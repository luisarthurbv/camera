from .base import BaseRepository
from .deputado import DeputadoRepository, PartidoRepository
from .legislatura import LegislaturaRepository
from .orgao import OrgaoRepository
from .votacao import VotacaoDeputadoRepository, VotacaoRepository

__all__ = [
    "BaseRepository",
    "DeputadoRepository",
    "PartidoRepository",
    "LegislaturaRepository",
    "OrgaoRepository",
    "VotacaoRepository",
    "VotacaoDeputadoRepository",
]
