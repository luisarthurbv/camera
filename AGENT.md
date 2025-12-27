L# AGENT.md

## Project Overview

This project is a monorepo for a service that provides information about the **Câmara dos Deputados do Brasil**. The goal is to centralize and process legislative data to provide valuable insights and services.

## Architecture & Applications

Our applications are primarily written in **Python**. The monorepo structure is managed using **Nx** and **UV**.

### Core Applications:

- **Lobby**: This application hosts our web services, exposing APIs and interfaces to interact with the processed data.
- **Cabral**: This is our data ingestion and processing layer. It feeds **Lobby** with the necessary data by fetching, cleaning, and organizing information from various sources related to the Câmara dos Deputados.

## Tech Stack

- **Language**: Python
- **Monorepo Management**: [Nx](https://nx.dev/)
- **Package Management**: [UV](https://github.com/astral-sh/uv)
- **Deployment**: Support for running the applications via **Docker**.

## Interaction Guidelines

- **Constructive Criticism**: If you think a requested approach is not the best path forward, stop and explain why. Propose alternative approaches that might be more efficient, maintainable, or aligned with the project's goals.

## Getting Started

You can run this application locally using Nx or within a Docker container.
