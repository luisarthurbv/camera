# AGENT.md - @apps/cabral

## Goal

**Cabral** is our data ingestion and experimentation application. Its primary responsibility is to fetch data from various sources (like the Câmara dos Deputados), process it (including PDF parsing and document conversion), and populate the shared domain (both relational and vector databases). It serves as the "discovery" and "preparation" arm of the project.

## Tech Stack

- **Experimentation**: [JupyterLab](https://jupyter.org/) for interactive development and data exploration.
- **Document Processing**: [MarkItDown](https://github.com/microsoft/markitdown) (with PDF support) for converting documents to markdown.
- **Embeddings & Search**: [Sentence-Transformers](https://sbert.net/) and [FAISS](https://github.com/facebookresearch/faiss) for efficient similarity search.
- **Vector Storage**: [ChromaDB](https://www.trychroma.com/) and [Ollama](https://ollama.com/) for embedding generation.
- **Data Handling**: [Pandas](https://pandas.pydata.org/) and [NumPy](https://numpy.org/).
