import React, { useRef, useEffect, useState } from 'react';

const RichTextEditor = ({ value, onChange, placeholder }) => {
    const editorRef = useRef(null);
    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        underline: false
    });

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCommand = (command) => {
        document.execCommand(command, false, null);
        editorRef.current?.focus();

        // Toggle the active state for the command
        if (command === 'bold') {
            setActiveFormats(prev => ({ ...prev, bold: !prev.bold }));
        } else if (command === 'italic') {
            setActiveFormats(prev => ({ ...prev, italic: !prev.italic }));
        } else if (command === 'underline') {
            setActiveFormats(prev => ({ ...prev, underline: !prev.underline }));
        }
    };

    return (
        <div style={{ width: '100%' }}>
            {/* Toolbar */}
            <div style={{
                backgroundColor: 'var(--surface-color)',
                border: '3px solid black',
                borderBottom: 'none',
                borderRadius: '12px 12px 0 0',
                padding: '0.75rem',
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap'
            }}>
                <button
                    type="button"
                    onClick={() => execCommand('bold')}
                    className="toolbar-btn"
                    title="Bold (Ctrl+B)"
                    style={{
                        fontWeight: 'bold',
                        padding: '0.5rem 0.75rem',
                        border: '2px solid black',
                        borderRadius: '8px',
                        backgroundColor: activeFormats.bold ? 'var(--primary-accent)' : '#fff',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem'
                    }}
                >
                    <strong>B</strong>
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('italic')}
                    className="toolbar-btn"
                    title="Italic (Ctrl+I)"
                    style={{
                        fontStyle: 'italic',
                        padding: '0.5rem 0.75rem',
                        border: '2px solid black',
                        borderRadius: '8px',
                        backgroundColor: activeFormats.italic ? 'var(--primary-accent)' : '#fff',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem'
                    }}
                >
                    <em>I</em>
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('underline')}
                    className="toolbar-btn"
                    title="Underline (Ctrl+U)"
                    style={{
                        textDecoration: 'underline',
                        padding: '0.5rem 0.75rem',
                        border: '2px solid black',
                        borderRadius: '8px',
                        backgroundColor: activeFormats.underline ? 'var(--primary-accent)' : '#fff',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem'
                    }}
                >
                    <u>U</u>
                </button>
                <div style={{ width: '2px', backgroundColor: 'black', margin: '0 0.25rem' }} />
                <button
                    type="button"
                    onClick={() => execCommand('insertUnorderedList')}
                    className="toolbar-btn"
                    title="Bullet List"
                    style={{
                        padding: '0.5rem 0.75rem',
                        border: '2px solid black',
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem'
                    }}
                >
                    •List
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('insertOrderedList')}
                    className="toolbar-btn"
                    title="Numbered List"
                    style={{
                        padding: '0.5rem 0.75rem',
                        border: '2px solid black',
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem'
                    }}
                >
                    1.List
                </button>
            </div>

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                data-placeholder={placeholder}
                className="rich-text-editor"
                style={{
                    backgroundColor: 'var(--surface-color)',
                    border: '3px solid black',
                    borderRadius: '0 0 12px 12px',
                    padding: '1rem',
                    minHeight: '150px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    fontFamily: 'var(--font-body)',
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                    color: 'var(--text-color)',
                    boxShadow: '5px 5px 0px 0px black',
                    outline: 'none'
                }}
            />
        </div>
    );
};

export default RichTextEditor;
