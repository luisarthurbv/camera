from typing import List

from sqlmodel import Session, select

from ..models.orgao import Orgao
from .base import BaseRepository


class OrgaoRepository(BaseRepository[Orgao]):
    def __init__(self, session: Session):
        super().__init__(Orgao, session)

    def get_by_sigla(self, sigla: str) -> List[Orgao]:
        statement = select(Orgao).where(Orgao.sigla == sigla)
        return self.session.exec(statement).all()
