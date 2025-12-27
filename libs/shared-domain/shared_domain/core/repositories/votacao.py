from typing import List, Optional

from sqlmodel import Session, select

from ..models.votacao import Votacao, VotacaoDeputado
from .base import BaseRepository


class VotacaoRepository(BaseRepository[Votacao]):
    def __init__(self, session: Session):
        super().__init__(Votacao, session)

    def get_with_votes(self, votacao_id: str) -> Optional[Votacao]:
        # In SQLModel, relationships are usually lazy loaded or can be joined
        return self.get(votacao_id)


class VotacaoDeputadoRepository(BaseRepository[VotacaoDeputado]):
    def __init__(self, session: Session):
        super().__init__(VotacaoDeputado, session)

    def get_by_deputado(self, deputado_id: int) -> List[VotacaoDeputado]:
        statement = select(VotacaoDeputado).where(
            VotacaoDeputado.deputado_id == deputado_id
        )
        return self.session.exec(statement).all()
