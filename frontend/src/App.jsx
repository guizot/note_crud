import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { fetchNotes, deleteNote, togglePinNote, restoreNote, permanentDeleteNote, fetchTags } from './api';
import HomePage from './pages/HomePage';
import NewNotePage from './pages/NewNotePage';
import DeleteDialog from './components/DeleteDialog';
import SortDialog from './components/SortDialog';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [currentView, setCurrentView] = useState('active');
  const [tags, setTags] = useState([]);
  const [searchExpanded, setSearchExpanded] = useState(false);

  // Dialog States
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSortDialogOpen, setIsSortDialogOpen] = useState(false);

  useEffect(() => {
    loadNotes();
    loadTags();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await fetchNotes(true);
      setNotes(data);
    } catch (err) {
      setError('Failed to load notes');
      console.error(err);
    }
  };

  const loadTags = async () => {
    try {
      const data = await fetchTags();
      setTags(data.map(t => t.name));
    } catch (err) {
      console.error('Failed to load tags:', err);
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

  const handleTogglePin = async (id) => {
    try {
      await togglePinNote(id);
      await loadNotes();
    } catch (err) {
      setError('Failed to toggle pin');
      console.error(err);
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreNote(id);
      await loadNotes();
    } catch (err) {
      setError('Failed to restore note');
      console.error(err);
    }
  };

  const handlePermanentDelete = async (id) => {
    try {
      await permanentDeleteNote(id);
      await loadNotes();
    } catch (err) {
      setError('Failed to permanently delete note');
      console.error(err);
    }
  };

  const switchView = (view) => {
    setCurrentView(view);
    setSearchQuery('');
  };

  // Filter by active/archived status first
  const viewFilteredNotes = notes.filter(note =>
    currentView === 'archived' ? note.is_archived === 1 : note.is_archived === 0
  );

  const filteredNotes = viewFilteredNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.category && note.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    // Always sort pinned notes to the top first (only for active view)
    if (currentView === 'active') {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
    }

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

  const isOnHomePage = location.pathname === '/';
  const isOnNewPage = location.pathname === '/new';
  const isOnEditPage = location.pathname.startsWith('/edit/');

  const getHeaderTitle = () => {
    if (isOnNewPage) return 'NEW NOTE';
    if (isOnEditPage) return 'EDIT NOTE';
    return 'NOTES';
  };

  return (
    <div className="app-container">
      <header className="main-header">
        <h1 className="header-title">{getHeaderTitle()}</h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {!isOnHomePage && (
            <button
              onClick={() => navigate('/')}
              className="btn"
              style={{
                height: '40px',
                padding: '0 1rem',
                borderRadius: '20px',
                minWidth: 'auto',
                fontSize: '1.1rem'
              }}
              title="Back to home"
            >
              ← BACK
            </button>
          )}
          {isOnHomePage && (
            <>
              {searchExpanded ? (
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flex: 1 }}>
                  <input
                    type="text"
                    placeholder="SEARCH NOTES..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-bar"
                    autoFocus
                    style={{ flex: 1, height: '40px' }}
                  />
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchExpanded(false);
                    }}
                    className="btn"
                    style={{
                      height: '40px',
                      padding: '0 1rem',
                      borderRadius: '20px',
                      minWidth: 'auto',
                      fontSize: '1.1rem'
                    }}
                    title="Close search"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={() => switchView('active')}
                      className="btn"
                      style={{
                        height: '40px',
                        padding: '0 1rem',
                        borderRadius: '20px',
                        minWidth: 'auto',
                        fontSize: '0.85rem',
                        backgroundColor: currentView === 'active' ? 'var(--primary-accent)' : 'var(--surface-color)',
                        fontWeight: currentView === 'active' ? '900' : '700',
                        border: currentView === 'active' ? '4px solid black' : '3px solid black'
                      }}
                    >
                      {currentView === 'active' ? '● ' : ''}ACTIVE
                    </button>
                    <button
                      onClick={() => switchView('archived')}
                      className="btn"
                      style={{
                        height: '40px',
                        padding: '0 1rem',
                        borderRadius: '20px',
                        minWidth: 'auto',
                        fontSize: '0.85rem',
                        backgroundColor: currentView === 'archived' ? 'var(--primary-accent)' : 'var(--surface-color)',
                        fontWeight: currentView === 'archived' ? '900' : '700',
                        border: currentView === 'archived' ? '4px solid black' : '3px solid black'
                      }}
                    >
                      {currentView === 'archived' ? '● ' : ''}ARCHIVED
                    </button>
                    <button
                      onClick={() => switchView('dashboard')}
                      className="btn"
                      style={{
                        height: '40px',
                        padding: '0 1rem',
                        borderRadius: '20px',
                        minWidth: 'auto',
                        fontSize: '0.85rem',
                        backgroundColor: currentView === 'dashboard' ? 'var(--primary-accent)' : 'var(--surface-color)',
                        fontWeight: currentView === 'dashboard' ? '900' : '700',
                        border: currentView === 'dashboard' ? '4px solid black' : '3px solid black'
                      }}
                    >
                      {currentView === 'dashboard' ? '● ' : ''}STATS
                    </button>
                  </div>
                  {currentView !== 'dashboard' && (
                    <>
                      <button
                        onClick={() => setIsSortDialogOpen(true)}
                        className="btn"
                        style={{
                          height: '40px',
                          padding: '0 1rem',
                          borderRadius: '20px',
                          minWidth: 'auto',
                          fontSize: '0.85rem'
                        }}
                      >
                        SORT
                      </button>
                      <button
                        onClick={() => setSearchExpanded(true)}
                        className="btn"
                        style={{
                          height: '40px',
                          padding: '0 1rem',
                          borderRadius: '20px',
                          minWidth: 'auto',
                          fontSize: '1.1rem'
                        }}
                        title="Search notes"
                      >
                        🔍
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => navigate('/new')}
                    className="btn btn-primary"
                    style={{
                      height: '40px',
                      padding: '0 1rem',
                      borderRadius: '20px',
                      minWidth: 'auto',
                      fontSize: '0.85rem'
                    }}
                  >
                    ➕ NEW NOTE
                  </button>
                </>
              )}
            </>
          )}
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

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              currentView={currentView}
              notes={sortedNotes}
              onDelete={confirmDelete}
              onPin={handleTogglePin}
              onRestore={handleRestore}
              onPermanentDelete={handlePermanentDelete}
            />
          }
        />
        <Route
          path="/new"
          element={
            <NewNotePage
              availableTags={tags}
              onNoteCreated={loadNotes}
            />
          }
        />
        <Route
          path="/edit/:id"
          element={
            <NewNotePage
              availableTags={tags}
              onNoteCreated={loadNotes}
            />
          }
        />
      </Routes>

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

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
