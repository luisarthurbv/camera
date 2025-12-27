from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from shared_domain import DeputadoRepository, QueryResult, VectorRepository, get_session

from ..config import CHROMA_DB_PATH, EMBEDDING_MODEL
from ..schemas import DeputadoListSchema, DeputadoSchema, QueryRequest

router = APIRouter()

# Initialize repository
repo = VectorRepository(chroma_db_path=CHROMA_DB_PATH, model=EMBEDDING_MODEL)


@router.get("/health")
async def health():
    return {"status": "ok"}


@router.post("/query", response_model=List[QueryResult])
async def query(request: QueryRequest):
    try:
        results = repo.search(query=request.text, n_results=request.n_results)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error querying RAG: {str(e)}")


@router.get("/deputados", response_model=DeputadoListSchema)
async def list_deputados(
    limit: int = 20, offset: int = 0, session: Session = Depends(get_session)
):
    repo = DeputadoRepository(session)
    deputados = repo.list(limit=limit, offset=offset)
    # Note: BaseRepository doesn't have a count method, but we can list all or just return what we have for now.
    # In a real app, we'd add a count method to the repository.
    return {"deputados": deputados, "total": len(deputados)}


@router.get("/deputados/{id}", response_model=DeputadoSchema)
async def get_deputado(id: int, session: Session = Depends(get_session)):
    repo = DeputadoRepository(session)
    deputado = repo.get(id)
    if not deputado:
        raise HTTPException(status_code=404, detail="Deputado not found")
    return deputado
