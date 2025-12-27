import os

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from .api.endpoints import router as api_router

app = FastAPI(title="Lobby RAG API")

# Include API endpoints
app.include_router(api_router, prefix="/api")

# Mount static files
static_dir = os.path.join(os.path.dirname(__file__), "static")
app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")


@app.on_event("startup")
async def startup_event():
    print("Lobby API is starting up...")
