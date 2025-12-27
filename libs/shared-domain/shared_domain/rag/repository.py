import os
from typing import List, Optional

import chromadb
import ollama

from .models import QueryResult, Speech, SpeechMetadata


class VectorRepository:
    """Encapsulates ChromaDB and Ollama embedding operations."""

    def __init__(
        self,
        collection_name: str = "ata_speeches",
        model: str = "qwen2.5:1.5b",
        chroma_db_path: str = "http://localhost:8123",
        ollama_host: Optional[str] = None,
    ):
        """
        Initializes the VectorRepository.

        Args:
            collection_name: Name of the ChromaDB collection.
            model: Embedding model name.
            chroma_db_path: Path to local persistence or URL for HTTP client.
            ollama_host: URL for Ollama service.
        """
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
        self.ollama_host = ollama_host or os.getenv(
            "OLLAMA_HOST", "http://localhost:11434"
        )
        self.ollama_client = ollama.Client(host=self.ollama_host)

    def _get_embedding(self, text: str, max_chars: int = 4000) -> List[float]:
        truncated_text = text[:max_chars]
        response = self.ollama_client.embeddings(
            model=self.model, prompt=truncated_text
        )
        return response["embedding"]

    def add_speeches(self, speeches: List[Speech]):
        """Embeds and stores a list of Speech objects."""
        documents = []
        metadatas = []
        ids = []
        embeddings = []

        for speech in speeches:
            if not speech.text.strip():
                continue

            emb = self._get_embedding(speech.text)

            documents.append(speech.text)
            metadatas.append(speech.metadata.model_dump())
            ids.append(speech.id)
            embeddings.append(emb)

        if documents:
            self.collection.add(
                embeddings=embeddings, documents=documents, metadatas=metadatas, ids=ids
            )

    def search(self, query: str, n_results: int = 5) -> List[QueryResult]:
        """Performs similarity search and returns QueryResult objects."""
        query_embedding = self._get_embedding(query)
        results = self.collection.query(
            query_embeddings=[query_embedding], n_results=n_results
        )

        query_results = []
        if not results["ids"]:
            return []

        for i in range(len(results["ids"][0])):
            speech = Speech(
                id=results["ids"][0][i],
                text=results["documents"][0][i],
                metadata=SpeechMetadata(**results["metadatas"][0][i]),
            )
            query_results.append(
                QueryResult(speech=speech, distance=results["distances"][0][i])
            )

        return query_results

    def clear_collection(self):
        """Deletes and recreates the collection."""
        try:
            name = self.collection.name
            self.client.delete_collection(name)
            self.collection = self.client.get_or_create_collection(name=name)
        except Exception:
            pass
