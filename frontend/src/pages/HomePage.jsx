import React from 'react';
import { useNavigate } from 'react-router-dom';
import NoteList from '../components/NoteList';
import Dashboard from '../components/Dashboard';

const HomePage = ({
    currentView,
    notes,
    onEdit,
    onDelete,
    onPin,
    onRestore,
    onPermanentDelete
}) => {
    const navigate = useNavigate();

    const handleEdit = (note) => {
        navigate(`/edit/${note.id}`);
    };

    return (
        <>
            {currentView === 'dashboard' ? (
                <Dashboard />
            ) : (
                <NoteList
                    notes={notes}
                    onEdit={handleEdit}
                    onDelete={onDelete}
                    onPin={onPin}
                    onRestore={onRestore}
                    onPermanentDelete={onPermanentDelete}
                    showArchived={currentView === 'archived'}
                />
            )}
        </>
    );
};

export default HomePage;
