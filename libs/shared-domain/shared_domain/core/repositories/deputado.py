from typing import List, Optional

from sqlmodel import Session, select

from ..models.deputado import Deputado, Partido
from .base import BaseRepository


class DeputadoRepository(BaseRepository[Deputado]):
    def __init__(self, session: Session):
        super().__init__(Deputado, session)

    def get_by_cpf(self, cpf: str) -> Optional[Deputado]:
        statement = select(Deputado).where(Deputado.cpf == cpf)
        return self.session.exec(statement).first()

    def search_by_name(self, name: str) -> List[Deputado]:
        statement = select(Deputado).where(Deputado.nome.contains(name))
        return self.session.exec(statement).all()


class PartidoRepository(BaseRepository[Partido]):
    def __init__(self, session: Session):
        super().__init__(Partido, session)

    def get_by_sigla(self, sigla: str) -> Optional[Partido]:
        statement = select(Partido).where(Partido.sigla == sigla)
        return self.session.exec(statement).first()
