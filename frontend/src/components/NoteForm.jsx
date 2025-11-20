import { useState, useEffect } from 'react';
import TagInput from './TagInput';
import RichTextEditor from './RichTextEditor';
import WarningDialog from './WarningDialog';

const CATEGORIES = ['GENERAL', 'WORKOUT', 'PERSONAL', 'WORK'];

const NoteForm = ({ onSubmit, initialData = null, onCancel, availableTags = [] }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('GENERAL');
    const [tags, setTags] = useState([]);
    const [warningDialogOpen, setWarningDialogOpen] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setContent(initialData.content);
            setCategory(initialData.category || 'GENERAL');
            setTags(initialData.tags ? initialData.tags.map(t => t.name) : []);
        } else {
            setTitle('');
            setContent('');
            setCategory('GENERAL');
            setTags([]);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate title
        if (!title.trim()) {
            setWarningMessage('PLEASE ENTER A TITLE');
            setWarningDialogOpen(true);
            return;
        }

        // Validate content is not empty (strip HTML tags to check actual text)
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';

        if (!textContent.trim()) {
            setWarningMessage('PLEASE ENTER CONTENT FOR YOUR NOTE');
            setWarningDialogOpen(true);
            return;
        }

        onSubmit({ title, content, category, tag_names: tags });
        if (!initialData) {
            setTitle('');
            setContent('');
            setCategory('GENERAL');
            setTags([]);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card">
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>CATEGORY</label>
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

            <div>
                <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>TITLE</label>
                <input
                    type="text"
                    placeholder="Type note title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field"
                />
            </div>

            <TagInput
                selectedTags={tags}
                onChange={setTags}
                availableTags={availableTags}
            />

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>CONTENT</label>
                <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Write your note content here..."
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

            <WarningDialog
                isOpen={warningDialogOpen}
                onClose={() => setWarningDialogOpen(false)}
                message={warningMessage}
            />
        </form >
    );
};

export default NoteForm;
