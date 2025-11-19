import { useState, useEffect } from 'react';

const CATEGORIES = ['GENERAL', 'WORKOUT', 'PERSONAL', 'WORK'];

const NoteForm = ({ onSubmit, initialData = null, onCancel }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('GENERAL');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setContent(initialData.content);
            setCategory(initialData.category || 'GENERAL');
        } else {
            setTitle('');
            setContent('');
            setCategory('GENERAL');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, content, category });
        if (!initialData) {
            setTitle('');
            setContent('');
            setCategory('GENERAL');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
            <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                marginBottom: '1.5rem',
                color: 'var(--text-color)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                lineHeight: 1
            }}>
                {initialData ? 'EDIT NOTE' : 'NEW NOTE'}
            </h2>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                    display: 'block',
                    color: 'var(--text-color)',
                    marginBottom: '0.5rem',
                    fontFamily: 'var(--font-body)',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase'
                }}>Category</label>
                <div className="chip-container">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            className={`chip ${category === cat ? 'selected' : ''}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="TITLE"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field"
                    required
                    style={{ textTransform: 'uppercase' }}
                />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <textarea
                    placeholder="CONTENT..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="input-field"
                    rows="6"
                    required
                    style={{
                        resize: 'vertical',
                        minHeight: '150px'
                    }}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                {initialData && (
                    <button type="button" onClick={onCancel} className="btn btn-danger">
                        CANCEL
                    </button>
                )}
                <button type="submit" className="btn btn-primary">
                    {initialData ? 'UPDATE' : 'SAVE NOTE'}
                </button>
            </div>
        </form>
    );
};

export default NoteForm;
