import { useState, useEffect } from 'react';
import { fetchNotes, createNote, updateNote, deleteNote } from './api';
import NoteList from './components/NoteList';
import NoteForm from './components/NoteForm';
import DeleteDialog from './components/DeleteDialog';
import SortDialog from './components/SortDialog';

function App() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc', 'date-asc', 'title-asc', 'title-desc'

  // Dialog States
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSortDialogOpen, setIsSortDialogOpen] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await fetchNotes();
      setNotes(data);
    } catch (err) {
      setError('Failed to load notes');
      console.error(err);
    }
  };

  const handleCreateOrUpdate = async (noteData) => {
    try {
      if (editingNote) {
        await updateNote(editingNote.id, noteData);
        setEditingNote(null);
      } else {
        await createNote(noteData);
      }
      await loadNotes();
    } catch (err) {
      setError('Failed to save note');
      console.error(err);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteNote(deleteId);
        loadNotes();
        setIsDeleteDialogOpen(false);
        setDeleteId(null);
      } catch (err) {
        setError('Failed to delete note');
        console.error(err);
      }
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.category && note.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    const dateA = new Date(a.created_at.endsWith('Z') ? a.created_at : a.created_at + 'Z');
    const dateB = new Date(b.created_at.endsWith('Z') ? b.created_at : b.created_at + 'Z');

    switch (sortBy) {
      case 'date-desc':
        return dateB - dateA;
      case 'date-asc':
        return dateA - dateB;
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      default:
        return dateB - dateA;
    }
  });

  return (
    <div className="app-container">
      <header className="main-header">
        <h1 className="header-title">NOTES</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={() => setIsSortDialogOpen(true)}
            className="btn"
            style={{
              height: '50px',
              padding: '0 1.5rem',
              borderRadius: '25px',
              minWidth: 'auto'
            }}
          >
            SORT
          </button>
          <input
            type="text"
            placeholder="SEARCH NOTES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
        </div>
      </header>

      {error && (
        <div style={{
          backgroundColor: '#ff6b6b',
          color: 'black',
          padding: '1rem',
          border: '3px solid black',
          borderRadius: '12px',
          marginBottom: '2rem',
          fontWeight: 'bold',
          boxShadow: '5px 5px 0px 0px black'
        }}>
          {error}
        </div>
      )}

      <div className="main-grid">
        <div className="sticky-sidebar">
          <NoteForm
            onSubmit={handleCreateOrUpdate}
            initialData={editingNote}
            onCancel={() => setEditingNote(null)}
          />
        </div>

        <div>
          <NoteList
            notes={sortedNotes}
            onEdit={handleEdit}
            onDelete={confirmDelete}
          />
        </div>
      </div>

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />

      <SortDialog
        isOpen={isSortDialogOpen}
        onClose={() => setIsSortDialogOpen(false)}
        currentSort={sortBy}
        onSortChange={setSortBy}
      />
    </div>
  );
}

export default App;
