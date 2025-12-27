from datetime import datetime
from typing import TYPE_CHECKING, List

if TYPE_CHECKING:
    from .deputado import Deputado
from sqlalchemy import Column, DateTime
from sqlmodel import Field, Relationship

from ..enums import Voto
from .base import BaseSQLModel


class Votacao(BaseSQLModel, table=True):
    __tablename__ = "votacoes"

    id: str = Field(primary_key=True)

    votos_deputados: List["VotacaoDeputado"] = Relationship(back_populates="votacao")


class VotacaoDeputado(BaseSQLModel, table=True):
    __tablename__ = "votacoes_deputados"

    id_votacao: str = Field(foreign_key="votacoes.id", primary_key=True)
    deputado_id: int = Field(foreign_key="deputados.id", primary_key=True)
    voto: Voto = Field(nullable=False)
    voto_moment: datetime = Field(sa_column=Column(DateTime, nullable=False))

    votacao: "Votacao" = Relationship(back_populates="votos_deputados")
    deputado: "Deputado" = Relationship(back_populates="votos")
