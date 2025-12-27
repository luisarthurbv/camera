# AGENT.md - @libs/shared-domain

## Goal

The **shared-domain** library is the core of our monorepo. It defines the shared data models, database schemas, and repository patterns used by both **Cabral** and **Lobby**. We follow **Domain-Driven Design (DDD)** principles to separate concerns and maintain a clean, model-centric architecture. It also encapsulates the RAG (Retrieval-Augmented Generation) infrastructure, providing a unified interface for vector storage and LLM interactions.

## Tech Stack

- **Language Architecture**: **Python with Typed Objects**. We strictly enforce type hints and structured data models to ensure long-term sustainability and maintainability as the codebase grows.
- **Data Modeling**: [Pydantic](https://docs.pydantic.dev/) for data validation and [SQLModel](https://sqlmodel.tiangolo.com/) for ORM.
- **Database**: PostgreSQL with [psycopg2](https://www.psycopg.org/) and migrations managed by [Alembic](https://alembic.sqlalchemy.org/).
- **Vector Database**: [ChromaDB](https://www.trychroma.com/) for storing and retrieving embeddings.
- **LLM/Embeddings**: [Ollama](https://ollama.com/) for running local models.
- **Data Analysis**: [Pandas](https://pandas.pydata.org/).
