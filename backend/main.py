from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

import models
import database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/notes", response_model=List[models.NoteResponse])
def read_notes(skip: int = 0, limit: int = 100, include_archived: bool = False, db: Session = Depends(get_db)):
    query = db.query(models.Note)
    if not include_archived:
        query = query.filter(models.Note.is_archived == 0)
    notes = query.offset(skip).limit(limit).all()
    return notes

@app.post("/notes", response_model=models.NoteResponse)
def create_note(note: models.NoteCreate, db: Session = Depends(get_db)):
    db_note = models.Note(
        title=note.title, 
        content=note.content,
        category=note.category
    )
    
    # Handle tags
    for tag_name in note.tag_names:
        tag_name = tag_name.strip()
        if tag_name:
            # Find or create tag
            tag = db.query(models.Tag).filter(models.Tag.name == tag_name).first()
            if not tag:
                tag = models.Tag(name=tag_name)
                db.add(tag)
            db_note.tags.append(tag)
    
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@app.put("/notes/{note_id}", response_model=models.NoteResponse)
def update_note(note_id: int, note: models.NoteCreate, db: Session = Depends(get_db)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db_note.title = note.title
    db_note.content = note.content
    db_note.category = note.category
    
    # Update tags
    db_note.tags.clear()
    for tag_name in note.tag_names:
        tag_name = tag_name.strip()
        if tag_name:
            tag = db.query(models.Tag).filter(models.Tag.name == tag_name).first()
            if not tag:
                tag = models.Tag(name=tag_name)
                db.add(tag)
            db_note.tags.append(tag)
    
    db.commit()
    db.refresh(db_note)
    return db_note

@app.delete("/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    """Soft delete - archives the note instead of permanent deletion"""
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db_note.is_archived = 1
    db_note.archived_at = datetime.utcnow()
    db.commit()
    return {"ok": True}

@app.patch("/notes/{note_id}/pin")
def toggle_pin_note(note_id: int, db: Session = Depends(get_db)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db_note.pinned = 1 if db_note.pinned == 0 else 0
    db.commit()
    db.refresh(db_note)
    return db_note

@app.patch("/notes/{note_id}/archive")
def archive_note(note_id: int, db: Session = Depends(get_db)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db_note.is_archived = 1
    db_note.archived_at = datetime.utcnow()
    db.commit()
    return {"ok": True}

@app.patch("/notes/{note_id}/restore")
def restore_note(note_id: int, db: Session = Depends(get_db)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db_note.is_archived = 0
    db_note.archived_at = None
    db.commit()
    return {"ok": True}

@app.delete("/notes/{note_id}/permanent")
def permanent_delete_note(note_id: int, db: Session = Depends(get_db)):
    """Permanently delete a note - only for archived notes"""
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db.delete(db_note)
    db.commit()
    return {"ok": True}

@app.get("/notes/stats")
def get_stats(db: Session = Depends(get_db)):
    """Get statistics about notes"""
    total_notes = db.query(models.Note).filter(models.Note.is_archived == 0).count()
    total_archived = db.query(models.Note).filter(models.Note.is_archived == 1).count()
    total_pinned = db.query(models.Note).filter(models.Note.pinned == 1, models.Note.is_archived == 0).count()
    
    # Category breakdown
    categories = {}
    category_results = db.query(models.Note.category, models.Note.id).filter(models.Note.is_archived == 0).all()
    for category, _ in category_results:
        cat_name = category or "GENERAL"
        categories[cat_name] = categories.get(cat_name, 0) + 1
    
    # Tag statistics
    tags = {}
    all_notes = db.query(models.Note).filter(models.Note.is_archived == 0).all()
    for note in all_notes:
        for tag in note.tags:
            tags[tag.name] = tags.get(tag.name, 0) + 1
    
    return {
        "total_notes": total_notes,
        "total_archived": total_archived,
        "total_pinned": total_pinned,
        "categories": categories,
        "tags": tags
    }

# Tag endpoints
@app.get("/tags", response_model=List[models.TagResponse])
def get_tags(db: Session = Depends(get_db)):
    tags = db.query(models.Tag).all()
    return tags

@app.post("/tags", response_model=models.TagResponse)
def create_tag(tag: models.TagCreate, db: Session = Depends(get_db)):
    # Check if tag already exists
    existing_tag = db.query(models.Tag).filter(models.Tag.name == tag.name).first()
    if existing_tag:
        return existing_tag
    
    db_tag = models.Tag(name=tag.name)
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag
