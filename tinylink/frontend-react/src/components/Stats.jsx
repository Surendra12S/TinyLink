import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchLinkStats } from '../api';
import ThemeToggle from './ThemeToggle';

const BASE_URL = 'http://localhost:3000';

export default function Stats() {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!code) {
            setError('No link code provided.');
            setLoading(false);
            return;
        }

        const loadStats = async () => {
            try {
                const data = await fetchLinkStats(code);
                setStats(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, [code]);

    if (loading) return <div className="container text-center" style={{ marginTop: '2rem' }}>Loading stats...</div>;
    if (error) return <div className="container text-center error" style={{ marginTop: '2rem' }}>{error}</div>;
    if (!stats) return null;

    return (
        <>
            <header>
                <div className="container header-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h1>TinyLink</h1>
                        <Link to="/" className="nav-link">Back to Dashboard</Link>
                    </div>
                    <ThemeToggle />
                </div>
            </header>
            <main className="container">
                <div id="statsContent" className="stats-card card">
                    <div className="card-header">
                        <h2>Link Statistics</h2>
                    </div>
                    <div className="stat-group">
                        <label>Short Code</label>
                        <div className="code-display">
                            <span className="highlight">{stats.code}</span>
                            <a
                                href={`${BASE_URL}/${stats.code}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="external-link-icon"
                                style={{ marginLeft: '0.5rem', textDecoration: 'none' }}
                            >
                                ↗
                            </a>
                        </div>
                    </div>
                    <div className="stat-group">
                        <label>Original URL</label>
                        <a href={stats.url} target="_blank" rel="noopener noreferrer" className="url-break">
                            {stats.url}
                        </a>
                    </div>
                    <div className="stat-grid">
                        <div className="stat-box">
                            <h3>Total Clicks</h3>
                            <p className="stat-number">{stats.clicks}</p>
                        </div>
                        <div className="stat-box">
                            <h3>Created At</h3>
                            <p>{new Date(stats.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="stat-box">
                            <h3>Last Clicked</h3>
                            <p>{stats.lastClickedAt ? new Date(stats.lastClickedAt).toLocaleString() : 'Never'}</p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
