import React, { useState, useEffect } from 'react';

const TagInput = ({ selectedTags = [], onChange, availableTags = [] }) => {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        setShowSuggestions(value.length > 0);
    };

    const handleAddTag = (tagName) => {
        const trimmedTag = tagName.trim();
        if (trimmedTag && !selectedTags.includes(trimmedTag)) {
            onChange([...selectedTags, trimmedTag]);
        }
        setInputValue('');
        setShowSuggestions(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            handleAddTag(inputValue);
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        onChange(selectedTags.filter(tag => tag !== tagToRemove));
    };

    const filteredSuggestions = availableTags
        .filter(tag =>
            tag.toLowerCase().includes(inputValue.toLowerCase()) &&
            !selectedTags.includes(tag)
        )
        .slice(0, 5);

    return (
        <div style={{ width: '100%', marginBottom: '1.5rem' }}>
            <label style={{
                display: 'block',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9rem',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>
                TAGS
            </label>

            {/* Selected Tags (Chips) */}
            {selectedTags.length > 0 && (
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginBottom: '0.75rem'
                }}>
                    {selectedTags.map((tag, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundColor: 'var(--secondary-accent)',
                                border: '2px solid black',
                                borderRadius: '20px',
                                padding: '0.4rem 0.8rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.85rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                boxShadow: '2px 2px 0px 0px black'
                            }}
                        >
                            {tag}
                            <button
                                onClick={() => handleRemoveTag(tag)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    padding: '0',
                                    lineHeight: 1,
                                    color: 'black'
                                }}
                                aria-label="Remove tag"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Input Field */}
            <div style={{ position: 'relative' }}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a tag and press Enter..."
                    className="input-field"
                    style={{
                        marginBottom: 0,
                        textTransform: 'none'
                    }}
                />

                {/* Autocomplete Suggestions */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'var(--surface-color)',
                        border: '3px solid black',
                        borderRadius: '12px',
                        marginTop: '0.5rem',
                        boxShadow: '5px 5px 0px 0px black',
                        zIndex: 1000,
                        maxHeight: '200px',
                        overflowY: 'auto'
                    }}>
                        {filteredSuggestions.map((tag, index) => (
                            <div
                                key={index}
                                onClick={() => handleAddTag(tag)}
                                style={{
                                    padding: '0.75rem 1rem',
                                    cursor: 'pointer',
                                    fontFamily: 'var(--font-body)',
                                    fontWeight: '700',
                                    fontSize: '0.9rem',
                                    textTransform: 'uppercase',
                                    borderBottom: index < filteredSuggestions.length - 1 ? '2px solid black' : 'none',
                                    transition: 'background-color 0.1s'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                {tag}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TagInput;
