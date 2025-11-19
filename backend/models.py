from sqlalchemy import Column, Integer, String, Text, DateTime, Table, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# Association table for many-to-many relationship
note_tags = Table('note_tags', Base.metadata,
    Column('note_id', Integer, ForeignKey('notes.id', ondelete='CASCADE')),
    Column('tag_id', Integer, ForeignKey('tags.id', ondelete='CASCADE'))
)

# SQLAlchemy Models
class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    category = Column(String, default="GENERAL")
    created_at = Column(DateTime, default=datetime.utcnow)
    pinned = Column(Integer, default=0)  # SQLite doesn't have Boolean, using 0/1
    is_archived = Column(Integer, default=0)
    archived_at = Column(DateTime, nullable=True)
    
    # Relationship to tags
    tags = relationship("Tag", secondary=note_tags, back_populates="notes")

class Tag(Base):
    __tablename__ = "tags"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    
    # Relationship to notes
    notes = relationship("Note", secondary=note_tags, back_populates="tags")

# Pydantic Models
class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    pass

class TagResponse(TagBase):
    id: int
    
    class Config:
        orm_mode = True

class NoteBase(BaseModel):
    title: str
    content: str
    category: str = "GENERAL"

class NoteCreate(NoteBase):
    tag_names: List[str] = []

class NoteResponse(NoteBase):
    id: int
    created_at: datetime
    pinned: int
    is_archived: int
    archived_at: Optional[datetime] = None
    tags: List[TagResponse] = []

    class Config:
        orm_mode = True
