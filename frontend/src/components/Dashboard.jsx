import React, { useState, useEffect } from 'react';
import { fetchStats } from '../api';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await fetchStats();
            setStats(data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load stats:', err);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                textAlign: 'center',
                marginTop: '4rem',
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                color: 'var(--surface-color)',
                textTransform: 'uppercase'
            }}>
                LOADING STATS...
            </div>
        );
    }

    if (!stats) {
        return (
            <div style={{
                textAlign: 'center',
                marginTop: '4rem',
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                color: 'var(--surface-color)',
                textTransform: 'uppercase'
            }}>
                NO STATS AVAILABLE
            </div>
        );
    }

    return (
        <div>
            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <div className="card" style={{
                    textAlign: 'center',
                    padding: '1.5rem'
                }}>
                    <div style={{
                        fontSize: '3rem',
                        fontFamily: 'var(--font-heading)',
                        lineHeight: 1,
                        marginBottom: '0.5rem'
                    }}>
                        {stats.total_notes}
                    </div>
                    <div style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        textTransform: 'uppercase'
                    }}>
                        Total Notes
                    </div>
                </div>

                <div className="card" style={{
                    backgroundColor: '#fff5cc',
                    textAlign: 'center',
                    padding: '1.5rem'
                }}>
                    <div style={{
                        fontSize: '3rem',
                        fontFamily: 'var(--font-heading)',
                        lineHeight: 1,
                        marginBottom: '0.5rem'
                    }}>
                        {stats.total_pinned}
                    </div>
                    <div style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        textTransform: 'uppercase'
                    }}>
                        Pinned Notes
                    </div>
                </div>

                <div className="card" style={{
                    backgroundColor: '#ff6b6b',
                    textAlign: 'center',
                    padding: '1.5rem'
                }}>
                    <div style={{
                        fontSize: '3rem',
                        fontFamily: 'var(--font-heading)',
                        lineHeight: 1,
                        marginBottom: '0.5rem'
                    }}>
                        {stats.total_archived}
                    </div>
                    <div style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        textTransform: 'uppercase'
                    }}>
                        Archived Notes
                    </div>
                </div>
            </div>

            {/* Category Breakdown */}
            {
                Object.keys(stats.categories).length > 0 && (
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <h3 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.5rem',
                            marginBottom: '1.5rem',
                            textTransform: 'uppercase'
                        }}>
                            📁 BY CATEGORY
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {Object.entries(stats.categories).map(([category, count]) => (
                                <div key={category} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}>
                                    <div style={{
                                        fontFamily: 'var(--font-body)',
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        textTransform: 'uppercase',
                                        minWidth: '120px'
                                    }}>
                                        {category}
                                    </div>
                                    <div style={{
                                        flex: 1,
                                        backgroundColor: '#fff',
                                        height: '30px',
                                        border: '2px solid black',
                                        borderRadius: '8px',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${(count / stats.total_notes) * 100}%`,
                                            height: '100%',
                                            backgroundColor: 'var(--secondary-accent)',
                                            transition: 'width 0.3s ease',
                                            borderRight: '2px solid black'
                                        }} />
                                    </div>
                                    <div style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '1.2rem',
                                        minWidth: '30px'
                                    }}>
                                        {count}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }

            {/* Tag Statistics */}
            {
                Object.keys(stats.tags).length > 0 && (
                    <div className="card">
                        <h3 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.5rem',
                            marginBottom: '1.5rem',
                            textTransform: 'uppercase'
                        }}>
                            🏷️ TAG USAGE
                        </h3>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.75rem'
                        }}>
                            {Object.entries(stats.tags)
                                .sort((a, b) => b[1] - a[1])
                                .map(([tag, count]) => (
                                    <div
                                        key={tag}
                                        style={{
                                            backgroundColor: 'var(--secondary-accent)',
                                            border: '3px solid black',
                                            borderRadius: '20px',
                                            padding: '0.6rem 1rem',
                                            fontFamily: 'var(--font-body)',
                                            fontSize: '0.9rem',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            boxShadow: '3px 3px 0px 0px black',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        {tag}
                                        <span style={{
                                            backgroundColor: 'black',
                                            color: 'var(--secondary-accent)',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.75rem',
                                            fontFamily: 'var(--font-heading)'
                                        }}>
                                            {count}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Dashboard;
