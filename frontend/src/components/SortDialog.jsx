import React from 'react';

const SORT_OPTIONS = [
    { value: 'date-desc', label: 'LATEST' },
    { value: 'date-asc', label: 'OLDEST' },
    { value: 'title-asc', label: 'TITLE (A-Z)' },
    { value: 'title-desc', label: 'TITLE (Z-A)' },
];

const SortDialog = ({ isOpen, onClose, currentSort, onSortChange }) => {
    if (!isOpen) return null;

    return (
        <div className="dialog-overlay" onClick={onClose}>
            <div className="dialog-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '300px' }}>
                <h3 style={{
                    margin: '0 0 1.5rem 0',
                    fontSize: '1.5rem',
                    fontFamily: 'var(--font-heading)',
                    textTransform: 'uppercase',
                    textAlign: 'center'
                }}>
                    SORT BY
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {SORT_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onSortChange(option.value);
                                onClose();
                            }}
                            className="btn"
                            style={{
                                width: '100%',
                                backgroundColor: currentSort === option.value ? 'var(--secondary-accent)' : 'var(--surface-color)',
                                justifyContent: 'space-between',
                                padding: '1rem'
                            }}
                        >
                            {option.label}
                            {currentSort === option.value && (
                                <span style={{ fontSize: '1.2rem' }}>✓</span>
                            )}
                        </button>
                    ))}
                </div>
                <button
                    onClick={onClose}
                    className="btn"
                    style={{
                        marginTop: '1.5rem',
                        width: '100%',
                        backgroundColor: 'transparent',
                        border: 'none',
                        boxShadow: 'none'
                    }}
                >
                    CLOSE
                </button>
            </div>
        </div>
    );
};

export default SortDialog;
