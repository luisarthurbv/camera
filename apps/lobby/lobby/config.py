import os

CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH", "http://localhost:8123")

# Shared domain model configuration
EMBEDDING_MODEL = "nomic-embed-text"
