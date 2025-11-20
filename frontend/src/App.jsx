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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const sortedNotes = notes
    .filter(note => {
      // Filter by view (active vs archived)
      if (currentView === 'active') {
        if (note.is_archived) return false;
      } else if (currentView === 'archived') {
        if (!note.is_archived) return false;
      }
      // Dashboard view doesn't show note list, so filtering doesn't matter as much for the list
      // but we might want to hide the list entirely in the render

      // Filter by search query
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        (note.category && note.category.toLowerCase().includes(query)) ||
        (note.tags && note.tags.some(tag => tag.name.toLowerCase().includes(query)))
      );
    })
    .sort((a, b) => {
      // First sort by pinned status (pinned first)
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      // Then sort by selected criteria
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);

      switch (sortBy) {
        case 'date-asc':
          return dateA - dateB;
        case 'date-desc':
          return dateB - dateA;
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
        <div className="header-content">
          <h1 className="header-title">{getHeaderTitle()}</h1>
          {!isOnHomePage && (
            <button
              onClick={() => navigate('/')}
              className="btn"
              style={{
                height: '40px',
                padding: '0 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem'
              }}
            >
              BACK
            </button>
          )}
        </div>

        {isOnHomePage && !searchExpanded && (
          <>
            <div className="header-tabs">
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
              <div className="header-actions">
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
                    fontSize: '1.2rem'
                  }}
                  title="Search"
                >
                  🔍
                </button>
                <button
                  onClick={() => navigate('/new')}
                  className="btn btn-primary"
                  style={{
                    height: '40px',
                    padding: '0 1rem',
                    borderRadius: '20px',
                    minWidth: 'auto',
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  + NEW NOTE
                </button>
              </div>
            )}
          </>
        )}

        {isOnHomePage && searchExpanded && (
          <div className="search-container" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flex: 1
          }}>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar"
              autoFocus
              style={{ flex: 1, height: '40px', marginBottom: 0 }}
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
        )}
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
