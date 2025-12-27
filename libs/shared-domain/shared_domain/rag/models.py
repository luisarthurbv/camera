from typing import List, Optional
from uuid import uuid4

from pydantic import BaseModel, Field


class SpeechMetadata(BaseModel):
    section: str
    speaker: str
    metadata: str = Field(
        default="", description="Additional info about the speaker (e.g. party/state)"
    )


class Speech(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    text: str
    metadata: SpeechMetadata
    embedding: Optional[List[float]] = None


class QueryResult(BaseModel):
    speech: Speech
    distance: float
