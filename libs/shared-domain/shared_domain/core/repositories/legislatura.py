from typing import Optional

from sqlmodel import Session, select

from ..models.legislatura import Legislatura
from .base import BaseRepository


class LegislaturaRepository(BaseRepository[Legislatura]):
    def __init__(self, session: Session):
        super().__init__(Legislatura, session)

    def get_latest(self) -> Optional[Legislatura]:
        statement = (
            select(Legislatura).order_by(Legislatura.data_inicio.desc()).limit(1)
        )
        return self.session.exec(statement).first()
