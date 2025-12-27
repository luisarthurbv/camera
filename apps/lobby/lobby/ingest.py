import os

from lobby.config import CHROMA_DB_PATH, EMBEDDING_MODEL
from shared_domain import ATAProcessor, VectorRepository

# Path to the ata.md file
MD_FILE = "/home/lvalini/development/camera/apps/cabral/notebooks/ata_analyzer/resources/ata.md"


def ingest():
    if not os.path.exists(MD_FILE):
        print(f"Error: {MD_FILE} not found.")
        return

    print(f"Reading {MD_FILE}...")
    processor = ATAProcessor()
    speeches = processor.parse_md(MD_FILE)
    print(f"Parsed {len(speeches)} speeches.")

    repo = VectorRepository(chroma_db_path=CHROMA_DB_PATH, model=EMBEDDING_MODEL)

    # repo.clear_collection() # Preserve if already partially done, but here we want a fresh start

    print(
        f"Ingesting {len(speeches)} speeches into ChromaDB at {CHROMA_DB_PATH} using {EMBEDDING_MODEL}..."
    )
    # Process in batches to avoid heavy load or OOM
    batch_size = 50
    for i in range(0, len(speeches), batch_size):
        batch = speeches[i : i + batch_size]
        print(
            f"Ingesting batch {i // batch_size + 1}/{(len(speeches) - 1) // batch_size + 1}..."
        )
        repo.add_speeches(batch)

    print("Ingestion complete.")


if __name__ == "__main__":
    ingest()
