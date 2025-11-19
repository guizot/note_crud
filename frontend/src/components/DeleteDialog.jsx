import React from 'react';

const DeleteDialog = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="dialog-overlay">
            <div className="dialog-content">
                <h3 style={{
                    margin: '0 0 16px 0',
                    fontSize: '24px',
                    fontWeight: '400',
                    color: 'var(--md-sys-color-on-surface)'
                }}>
                    Delete note?
                </h3>
                <p style={{
                    margin: '0 0 24px 0',
                    color: 'var(--md-sys-color-on-surface-variant)',
                    fontSize: '16px',
                    lineHeight: '1.5'
                }}>
                    This will permanently delete this note. This action cannot be undone.
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                        onClick={onClose}
                        className="btn"
                        style={{
                            background: 'transparent',
                            color: 'var(--md-sys-color-primary)'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="btn"
                        style={{
                            background: 'transparent',
                            color: 'var(--md-sys-color-error)'
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteDialog;
