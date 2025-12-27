from datetime import date
from typing import List, Optional

from pydantic import BaseModel

from shared_domain.core import Sexo


class QueryRequest(BaseModel):
    text: str
    n_results: int = 5


class DeputadoSchema(BaseModel):
    id: int
    nome: Optional[str]
    nome_civil: str
    cpf: Optional[str]
    sexo: Optional[Sexo]
    data_nascimento: Optional[date]
    uf_nascimento: Optional[str]
    municipio_nascimento: Optional[str]
    website: Optional[str]
    redes_sociais: Optional[List[str]]

    class Config:
        from_attributes = True


class DeputadoListSchema(BaseModel):
    deputados: List[DeputadoSchema]
    total: int
