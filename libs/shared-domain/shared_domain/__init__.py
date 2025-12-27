from .core import (
    BaseRepository,
    BaseSQLModel,
    Deputado,
    DeputadoLegislatura,
    DeputadoRepository,
    Legislatura,
    LegislaturaRepository,
    Membro,
    Ocupacao,
    Orgao,
    OrgaoRepository,
    Partido,
    PartidoRepository,
    Profissao,
    Votacao,
    VotacaoDeputado,
    VotacaoDeputadoRepository,
    VotacaoRepository,
    engine,
    enums,
    get_session,
    init_db,
)
from .rag import models as rag_models
from .rag.processor import ATAProcessor
from .rag.repository import VectorRepository

# Re-export key RAG items for backward compatibility
Speech = rag_models.Speech
SpeechMetadata = rag_models.SpeechMetadata
QueryResult = rag_models.QueryResult

__all__ = [
    "engine",
    "get_session",
    "init_db",
    "BaseSQLModel",
    "Deputado",
    "Partido",
    "Ocupacao",
    "Profissao",
    "Legislatura",
    "DeputadoLegislatura",
    "Orgao",
    "Membro",
    "Votacao",
    "VotacaoDeputado",
    "BaseRepository",
    "DeputadoRepository",
    "PartidoRepository",
    "LegislaturaRepository",
    "OrgaoRepository",
    "VotacaoRepository",
    "VotacaoDeputadoRepository",
    "enums",
    "rag_models",
    "ATAProcessor",
    "VectorRepository",
    "Speech",
    "SpeechMetadata",
    "QueryResult",
]
