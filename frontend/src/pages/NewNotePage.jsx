import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NoteForm from '../components/NoteForm';
import { createNote, updateNote, fetchNotes } from '../api';

const NewNotePage = ({ availableTags, onNoteCreated }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [editingNote, setEditingNote] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            loadNote();
        }
    }, [id]);

    const loadNote = async () => {
        try {
            setLoading(true);
            const data = await fetchNotes(true);
            const note = data.find(n => n.id === parseInt(id));
            if (note) {
                setEditingNote(note);
            }
        } catch (err) {
            console.error('Failed to load note:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (noteData) => {
        try {
            if (editingNote) {
                await updateNote(editingNote.id, noteData);
            } else {
                await createNote(noteData);
            }
            if (onNoteCreated) {
                onNoteCreated();
            }
            navigate('/');
        } catch (err) {
            console.error('Failed to save note:', err);
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div style={{
                textAlign: 'center',
                marginTop: '4rem',
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                color: 'var(--surface-color)',
                textTransform: 'uppercase'
            }}>
                LOADING...
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: '800px',
            margin: '0 auto'
        }}>
            <NoteForm
                onSubmit={handleSubmit}
                initialData={editingNote}
                onCancel={handleCancel}
                availableTags={availableTags}
            />
        </div>
    );
};

export default NewNotePage;
