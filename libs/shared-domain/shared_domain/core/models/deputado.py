from datetime import date
from typing import TYPE_CHECKING, List, Optional

if TYPE_CHECKING:
    from .legislatura import DeputadoLegislatura, Membro
    from .votacao import VotacaoDeputado
from uuid import UUID, uuid4

from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import ARRAY
from sqlmodel import Field, Relationship

from ..enums import Sexo
from .base import BaseSQLModel


class Deputado(BaseSQLModel, table=True):
    __tablename__ = "deputados"

    id: Optional[int] = Field(default=None, primary_key=True)
    cpf: Optional[str] = Field(default=None, unique=True, index=True)
    nome_civil: str = Field(nullable=False, index=True)
    nome: Optional[str] = Field(default=None)
    sexo: Optional[Sexo] = Field(default=None)
    data_nascimento: Optional[date] = Field(default=None)
    data_falecimento: Optional[date] = Field(default=None)
    uf_nascimento: Optional[str] = Field(default=None)
    municipio_nascimento: Optional[str] = Field(default=None)
    redes_sociais: Optional[List[str]] = Field(
        default=None, sa_column=Column(ARRAY(String))
    )
    website: Optional[str] = Field(default=None)

    profissoes: List["Profissao"] = Relationship(back_populates="deputado")
    ocupacoes: List["Ocupacao"] = Relationship(back_populates="deputado")
    legislaturas: List["DeputadoLegislatura"] = Relationship(back_populates="deputado")
    membros: List["Membro"] = Relationship(back_populates="deputado")
    votos: List["VotacaoDeputado"] = Relationship(back_populates="deputado")


class Partido(BaseSQLModel, table=True):
    __tablename__ = "partidos"

    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str = Field(unique=True, nullable=False)
    sigla: str = Field(unique=True, nullable=False)

    deputado_legislaturas: List["DeputadoLegislatura"] = Relationship(
        back_populates="partido"
    )
    membros: List["Membro"] = Relationship(back_populates="partido")


class Ocupacao(BaseSQLModel, table=True):
    __tablename__ = "deputado_ocupacao"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    deputado_id: int = Field(foreign_key="deputados.id", index=True)
    titulo: str = Field(nullable=False)
    entidade: str = Field(nullable=False)

    deputado: "Deputado" = Relationship(back_populates="ocupacoes")


class Profissao(BaseSQLModel, table=True):
    __tablename__ = "deputado_profissao"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    deputado_id: int = Field(foreign_key="deputados.id", index=True)
    titulo: str = Field(nullable=False)

    deputado: "Deputado" = Relationship(back_populates="profissoes")
