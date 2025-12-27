from datetime import date
from typing import TYPE_CHECKING, List, Optional

if TYPE_CHECKING:
    from .deputado import Deputado, Partido
from uuid import UUID, uuid4

from sqlalchemy import Column, Date
from sqlmodel import Field, Relationship

from .base import BaseSQLModel


class Legislatura(BaseSQLModel, table=True):
    __tablename__ = "legislaturas"

    id: Optional[int] = Field(default=None, primary_key=True)
    data_inicio: date = Field(sa_column=Column(Date, nullable=False))
    data_fim: date = Field(sa_column=Column(Date, nullable=False))

    deputado_legislaturas: List["DeputadoLegislatura"] = Relationship(
        back_populates="legislatura"
    )
    membros: List["Membro"] = Relationship(back_populates="legislatura")


class DeputadoLegislatura(BaseSQLModel, table=True):
    __tablename__ = "deputado_legislatura"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    deputado_id: int = Field(foreign_key="deputados.id", index=True)
    legislatura_id: int = Field(foreign_key="legislaturas.id", index=True)
    partido_id: int = Field(foreign_key="partidos.id", index=True)
    start_date: date = Field(sa_column=Column(Date, nullable=False))
    end_date: date = Field(sa_column=Column(Date, nullable=False))
    estado: str = Field(nullable=False)

    deputado: "Deputado" = Relationship(back_populates="legislaturas")
    legislatura: "Legislatura" = Relationship(back_populates="deputado_legislaturas")
    partido: "Partido" = Relationship(back_populates="deputado_legislaturas")


class Membro(BaseSQLModel, table=True):
    __tablename__ = "membros"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    deputado_id: int = Field(foreign_key="deputados.id")
    partido_id: int = Field(foreign_key="partidos.id")
    legislatura_id: int = Field(foreign_key="legislaturas.id")

    deputado: "Deputado" = Relationship(back_populates="membros")
    partido: "Partido" = Relationship(back_populates="membros")
    legislatura: "Legislatura" = Relationship(back_populates="membros")
