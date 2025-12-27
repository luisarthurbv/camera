# AGENT.md - @apps/lobby

## Goal

**Lobby** is our public-facing application. It provides a web server that exposes APIs for querying the processed legislative data. We aim to follow **Domain-Driven Design (DDD)** to ensure the application remains scalable and aligned with business requirements. It leverages the search and RAG capabilities defined in the shared domain to provide intelligent answers and information retrieval services.

## Tech Stack

- **Language Architecture**: **Python with Typed Objects**. Strict adherence to type hints is required for better sustainability.
- **Web Framework**: [FastAPI](https://fastapi.tiangolo.com/) for building modern, high-performance APIs.
- **ASGI Server**: [Uvicorn](https://www.uvicorn.org/) for running the FastAPI application.
- **Domain Logic**: Dependency on **@libs/shared-domain** for all data and search operations.
