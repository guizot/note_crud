import React from 'react';

const WarningDialog = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div className="dialog-overlay">
            <div className="dialog-content">
                <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2rem',
                    marginBottom: '1rem',
                    color: 'var(--text-color)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    ⚠️ WARNING
                </h3>
                <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1.1rem',
                    marginBottom: '2rem',
                    color: 'var(--text-color)',
                    fontWeight: '600'
                }}>
                    {message}
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        className="btn btn-primary"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WarningDialog;
