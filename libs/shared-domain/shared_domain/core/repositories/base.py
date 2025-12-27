from typing import Generic, List, Optional, Type, TypeVar

from sqlmodel import Session, select

from ..models.base import BaseSQLModel

T = TypeVar("T", bound=BaseSQLModel)


class BaseRepository(Generic[T]):
    def __init__(self, model: Type[T], session: Session):
        self.model = model
        self.session = session

    def get(self, id: any) -> Optional[T]:
        return self.session.get(self.model, id)

    def list(self, limit: int = 100, offset: int = 0) -> List[T]:
        statement = select(self.model).limit(limit).offset(offset)
        return self.session.exec(statement).all()

    def create(self, entity: T) -> T:
        self.session.add(entity)
        self.session.commit()
        self.session.refresh(entity)
        return entity

    def update(self, entity: T) -> T:
        self.session.add(entity)
        self.session.commit()
        self.session.refresh(entity)
        return entity

    def delete(self, id: any) -> bool:
        entity = self.get(id)
        if entity:
            self.session.delete(entity)
            self.session.commit()
            return True
        return False
