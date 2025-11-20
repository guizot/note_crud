import React, { useState, useEffect } from 'react';

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

const NoteList = ({ notes, onEdit, onDelete, onPin, onRestore, onPermanentDelete, showArchived = false }) => {
    const [numColumns, setNumColumns] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setNumColumns(1);
            else if (window.innerWidth < 1024) setNumColumns(2);
            else setNumColumns(3);
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (notes.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                color: 'var(--surface-color)',
                marginTop: '4rem',
                fontFamily: 'var(--font-heading)',
                fontSize: '1.5rem',
                textTransform: 'uppercase',
                textShadow: '2px 2px 0px black'
            }}>
                {showArchived ? 'NO ARCHIVED NOTES.' : 'NO NOTES FOUND.'}
            </div>
        );
    }

    // Distribute notes into columns
    const columns = Array.from({ length: numColumns }, () => []);
    notes.forEach((note, i) => {
        columns[i % numColumns].push(note);
    });

    return (
        <div style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'flex-start'
        }}>
            {columns.map((colNotes, colIndex) => (
                <div key={colIndex} style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                    minWidth: 0 // Prevents flex items from overflowing
                }}>
                    {colNotes.map((note) => (
                        <div
                            key={note.id}
                            className={`card ${note.pinned ? 'pinned-note' : ''}`}
                            style={note.pinned ? {
                                backgroundColor: '#fff5cc',
                                boxShadow: '8px 8px 0px 0px black'
                            } : {}}
                        >
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

                                {!showArchived && (
                                    <button
                                        onClick={() => onPin(note.id)}
                                        className="pin-btn"
                                        title={note.pinned ? "Unpin note" : "Pin note"}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '1.5rem',
                                            cursor: 'pointer',
                                            padding: '0.5rem',
                                            lineHeight: 1,
                                            transition: 'transform 0.2s'
                                        }}
                                    >
                                        {note.pinned ? '⭐' : '☆'}
                                    </button>
                                )}
                            </div>

                            <div
                                style={{
                                    color: 'var(--text-color)',
                                    lineHeight: '1.6',
                                    margin: '0 0 1rem 0',
                                    fontSize: '1.1rem',
                                    fontFamily: 'var(--font-body)'
                                }}
                                dangerouslySetInnerHTML={{ __html: note.content }}
                            />

                            {/* Display Tags */}
                            {note.tags && note.tags.length > 0 && (
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '0.5rem',
                                    marginBottom: '1.5rem'
                                }}>
                                    {note.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            style={{
                                                backgroundColor: 'var(--secondary-accent)',
                                                border: '2px solid black',
                                                borderRadius: '20px',
                                                padding: '0.3rem 0.7rem',
                                                fontFamily: 'var(--font-body)',
                                                fontSize: '0.75rem',
                                                fontWeight: '700',
                                                textTransform: 'uppercase',
                                                boxShadow: '2px 2px 0px 0px black'
                                            }}
                                        >
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                {!showArchived ? (
                                    <>
                                        <button
                                            onClick={() => onEdit(note)}
                                            className="btn"
                                            style={{
                                                padding: '0.5rem 1rem',
                                                fontSize: '0.9rem',
                                                minWidth: 'auto',
                                                backgroundColor: '#fff'
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
                                                minWidth: 'auto'
                                            }}
                                        >
                                            ARCHIVE
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => onRestore(note.id)}
                                            className="btn"
                                            style={{
                                                padding: '0.5rem 1rem',
                                                fontSize: '0.9rem',
                                                minWidth: 'auto',
                                                backgroundColor: '#fff'
                                            }}
                                        >
                                            RESTORE
                                        </button>
                                        <button
                                            onClick={() => onPermanentDelete(note.id)}
                                            className="btn btn-danger"
                                            style={{
                                                padding: '0.5rem 1rem',
                                                fontSize: '0.9rem',
                                                minWidth: 'auto'
                                            }}
                                        >
                                            DELETE
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default NoteList;
