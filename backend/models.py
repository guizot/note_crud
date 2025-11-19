from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# SQLAlchemy Model
class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    category = Column(String, default="GENERAL")
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic Models
class NoteBase(BaseModel):
    title: str
    content: str
    category: str = "GENERAL"

class NoteCreate(NoteBase):
    pass

class NoteResponse(NoteBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
