from datetime import datetime

from sqlalchemy import DateTime, text
from sqlmodel import Field, SQLModel


class BaseSQLModel(SQLModel):
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={"server_default": text("now()")},
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={"server_default": text("now()"), "onupdate": text("now()")},
    )
