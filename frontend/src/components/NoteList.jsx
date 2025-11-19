import React from 'react';

const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    // Append 'Z' to indicate UTC if not present, to fix the 7-hour offset issue
    const date = new Date(dateString.endsWith('Z') ? dateString : dateString + 'Z');
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "NOW";

    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} YEAR${years > 1 ? 'S' : ''} AGO`;
    if (months > 0) return `${months} MONTH${months > 1 ? 'S' : ''} AGO`;
    if (days > 0) return `${days} DAY${days > 1 ? 'S' : ''} AGO`;

    if (hours > 0) {
        const remainingMins = minutes % 60;
        if (remainingMins > 0) {
            return `${hours} HR ${remainingMins} MIN AGO`;
        }
        return `${hours} HR AGO`;
    }

    return `${minutes} MIN AGO`;
};

const NoteList = ({ notes, onEdit, onDelete }) => {
    if (notes.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                color: 'var(--surface-color)',
                marginTop: '4rem',
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                textTransform: 'uppercase',
                textShadow: '2px 2px 0px black'
            }}>
                NO NOTES FOUND.
            </div>
        );
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2rem'
        }}>
            {notes.map((note) => (
                <div key={note.id} className="card">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '1rem'
                    }}>
                        <div>
                            <h3 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.8rem',
                                margin: '0 0 0.5rem 0',
                                color: 'var(--text-color)',
                                textTransform: 'uppercase',
                                lineHeight: 1
                            }}>
                                {note.title}
                            </h3>
                            <div style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                color: 'var(--text-color)',
                                textTransform: 'uppercase',
                                display: 'flex',
                                gap: '0.5rem',
                                alignItems: 'center'
                            }}>
                                <span style={{
                                    backgroundColor: 'var(--secondary-accent)',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    border: '2px solid black'
                                }}>
                                    {note.category || 'GENERAL'}
                                </span>
                                <span>{formatTimeAgo(note.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    <p style={{
                        whiteSpace: 'pre-wrap',
                        color: 'var(--text-color)',
                        lineHeight: '1.6',
                        margin: '0 0 1.5rem 0',
                        fontSize: '1.1rem',
                        fontFamily: 'var(--font-body)'
                    }}>
                        {note.content}
                    </p>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '1rem'
                    }}>
                        <button
                            onClick={() => onEdit(note)}
                            className="btn"
                            style={{
                                padding: '0.5rem 1rem',
                                fontSize: '0.9rem',
                                minWidth: '80px'
                            }}
                        >
                            EDIT
                        </button>
                        <button
                            onClick={() => onDelete(note.id)}
                            className="btn btn-danger"
                            style={{
                                padding: '0.5rem 1rem',
                                fontSize: '0.9rem',
                                minWidth: '80px'
                            }}
                        >
                            DELETE
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NoteList;
