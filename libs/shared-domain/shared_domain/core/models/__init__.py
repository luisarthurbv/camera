from .base import BaseSQLModel
from .deputado import Deputado, Ocupacao, Partido, Profissao
from .legislatura import DeputadoLegislatura, Legislatura, Membro
from .orgao import Orgao
from .votacao import Votacao, VotacaoDeputado

__all__ = [
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
]
