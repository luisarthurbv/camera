from datetime import date
from typing import Optional

from sqlmodel import Field

from ..enums import Casa
from .base import BaseSQLModel


class Orgao(BaseSQLModel, table=True):
    __tablename__ = "orgaos"

    id: int = Field(primary_key=True)
    sigla: str = Field(nullable=False, index=True)
    apelido: str = Field(nullable=False)
    nome: str = Field(nullable=False)
    nome_publicacao: Optional[str] = Field(default=None)
    cod_tipo_orgao: int = Field(index=True)
    tipo_orgao: str = Field(nullable=False)
    data_inicio: Optional[date] = Field(default=None)
    data_instalacao: Optional[date] = Field(default=None)
    data_fim: Optional[date] = Field(default=None)
    data_fim_original: Optional[date] = Field(default=None)
    cod_situacao: Optional[int] = Field(default=None)
    descricao_situacao: Optional[str] = Field(default=None)
    casa: Casa = Field(nullable=False)
    sala: Optional[str] = Field(default=None)
    url_website: Optional[str] = Field(default=None)
