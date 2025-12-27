# import numpy as np
# from sentence_transformers import SentenceTransformer
# import faiss
import os
import re
import uuid

import chromadb
import ollama
import pandas as pd


class ATAProcessor:
    """Parses the Brazilian Chamber of Deputies transcript into a structured format."""

    @staticmethod
    def parse_md(md_path):
        if not os.path.exists(md_path):
            raise FileNotFoundError(f"File {md_path} not found.")

        with open(md_path, encoding="utf-8") as f:
            lines = f.readlines()

        data = []
        current_section = "Unknown"

        # Regex for speakers: O SR. [INFO] - [TEXT] or A SRA. [INFO] - [TEXT]
        speaker_pattern = re.compile(r"^(O SR\.|A SRA\.)\s+(.+?)\s*-\s*(.*)", re.DOTALL)
        # Regex for sections: ALL CAPS lines (e.g., BREVES COMUNICAÇÕES)
        section_pattern = re.compile(r"^[A-ZÀ-Ú\s]+$")
        # Regex for page markers like 1/120 or Sessão de...
        page_marker_pattern = re.compile(
            r"^(\d+/\d+|\x0c?Sessão de.*|Notas Taquigráficas|"
            r"Transcrição Taquigráficas|CÂMARA DOS DEPUTADOS|DEPARTAMENTO DE.*|"
            r".*SESSÃO LEGISLATIVA.*|.*SESSÃO.*|^\d+$)",
            re.IGNORECASE,
        )

        current_speaker_info = None
        current_speech = []

        for line in lines:
            line = line.strip()
            if not line:
                continue

            # Skip page markers and boilerplate
            if page_marker_pattern.match(line):
                continue

            # Check for section header (exclude common short words or noisy caps)
            if (
                section_pattern.match(line)
                and len(line) > 5
                and not speaker_pattern.match(line)
            ):
                if current_speaker_info:
                    data.append(
                        {
                            "section": current_section,
                            "speaker": current_speaker_info["name"],
                            "metadata": current_speaker_info["meta"],
                            "text": " ".join(current_speech).strip(),
                        }
                    )
                    current_speaker_info = None
                    current_speech = []
                current_section = line
                continue

            # Check for speaker
            match = speaker_pattern.match(line)
            if match:
                if current_speaker_info:
                    data.append(
                        {
                            "section": current_section,
                            "speaker": current_speaker_info["name"],
                            "metadata": current_speaker_info["meta"],
                            "text": " ".join(current_speech).strip(),
                        }
                    )

                prefix, info, first_part = match.groups()

                # Extract meta from parentheses
                name_meta = re.search(r"\((.+?)\)", info)
                if name_meta:
                    metadata = name_meta.group(1)
                    speaker_name = info.split("(")[0].strip()
                else:
                    speaker_name = info
                    metadata = ""

                current_speaker_info = {"name": speaker_name, "meta": metadata}
                current_speech = [first_part]
            else:
                if current_speaker_info:
                    current_speech.append(line)

        # Final flush
        if current_speaker_info:
            data.append(
                {
                    "section": current_section,
                    "speaker": current_speaker_info["name"],
                    "metadata": current_speaker_info["meta"],
                    "text": " ".join(current_speech).strip(),
                }
            )

        return pd.DataFrame(data)


class RAGProcessor:
    """Handles vector storage and retrieval using ChromaDB and Ollama."""

    def __init__(
        self,
        collection_name="ata_speeches",
        model="nomic-embed-text",
        host=None,
        chroma_db_path=None,
    ):
        chroma_db_path = chroma_db_path or os.getenv(
            "CHROMA_DB_PATH", "http://localhost:8123"
        )
        if chroma_db_path.startswith("http"):
            from urllib.parse import urlparse

            url = urlparse(chroma_db_path)
            self.client = chromadb.HttpClient(
                host=url.hostname or "localhost",
                port=url.port or 8000,
                ssl=url.scheme == "https",
            )
        else:
            self.client = chromadb.PersistentClient(path=chroma_db_path)
        self.collection = self.client.get_or_create_collection(name=collection_name)
        self.model = model
        self.host = host or os.getenv("OLLAMA_HOST", "http://localhost:11434")
        self.ollama_client = ollama.Client(host=self.host)

    def get_embedding(self, text, max_chars=4000):
        # Truncate text to avoid context length errors
        truncated_text = text[:max_chars]
        response = self.ollama_client.embeddings(
            model=self.model, prompt=truncated_text
        )
        return response["embedding"]

    def embed_and_store(self, df):
        """Embeds text from DataFrame and stores it in ChromaDB."""
        documents = []
        metadatas = []
        ids = []
        embeddings = []

        total = len(df)
        print(f"Starting ingestion of {total} documents...")

        for i, (_, row) in enumerate(df.iterrows()):
            if i % 10 == 0:
                print(f"Processing document {i}/{total}...")

            text = row["text"]
            if not text.strip():
                continue

            # Generate embedding
            embedding = self.get_embedding(text)

            documents.append(text)
            metadatas.append(
                {
                    "section": row["section"],
                    "speaker": row["speaker"],
                    "metadata": row["metadata"],
                }
            )
            ids.append(str(uuid.uuid4()))
            embeddings.append(embedding)

        if documents:
            self.collection.add(
                embeddings=embeddings, documents=documents, metadatas=metadatas, ids=ids
            )
            print(f"Stored {len(documents)} documents in ChromaDB.")

    def query(self, query_text, n_results=5):
        """Queries ChromaDB for relevant documents."""
        query_embedding = self.get_embedding(query_text)
        results = self.collection.query(
            query_embeddings=[query_embedding], n_results=n_results
        )
        return results


if __name__ == "__main__":
    # Test script
    md_file = (
        "/home/lvalini/development/camera/apps/cabral/notebooks/"
        "ata_analyzer/resources/ata.md"
    )
    processor = ATAProcessor()
    df_ata = processor.parse_md(md_file)
    print(f"Parsed {len(df_ata)} speeches.")

    # Initialize RAG Processor
    rag = RAGProcessor()

    # Clear existing collection for fresh ingestion
    try:
        rag.client.delete_collection("ata_speeches")
        rag.collection = rag.client.get_or_create_collection("ata_speeches")
        print("Cleared existing collection.")
    except Exception:
        pass

    # Ingestion of all speeches
    print("Ingesting all speeches into ChromaDB...")
    rag.embed_and_store(df_ata)

    # Simple Query
    query_text = "Quais são os principais temas discutidos?"
    print(f"Querying: {query_text}")
    results = rag.query(query_text, n_results=3)

    for i, (doc, meta) in enumerate(
        zip(results["documents"][0], results["metadatas"][0], strict=False)
    ):
        print(f"\nResult {i + 1}:")
        print(f"Speaker: {meta['speaker']}")
        print(f"Text: {doc[:200]}...")
