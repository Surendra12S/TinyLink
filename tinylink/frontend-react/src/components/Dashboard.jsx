import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check } from 'lucide-react';
import { fetchLinks, createLink, deleteLink } from '../api';
import ThemeToggle from './ThemeToggle';

const BASE_URL = 'http://localhost:3000';

export default function Dashboard() {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ url: '', code: '' });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        loadLinks();
    }, []);

    const loadLinks = async () => {
        try {
            setLoading(true);
            const data = await fetchLinks();
            setLinks(data);
        } catch (err) {
            setError('Failed to load links.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ text: '', type: '' });

        try {
            const data = await createLink(formData.url, formData.code);
            setMessage({ text: `Success! Link created: ${BASE_URL}/${data.code}`, type: 'success' });
            setFormData({ url: '', code: '' });
            loadLinks();
        } catch (err) {
            setMessage({ text: err.message, type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (code) => {
        if (!confirm('Are you sure you want to delete this link?')) return;

        try {
            await deleteLink(code);
            setLinks(links.filter(link => link.code !== code));
        } catch (err) {
            alert('Failed to delete link');
        }
    };

    const handleCopy = (code) => {
        const link = `${BASE_URL}/${code}`;
        navigator.clipboard.writeText(link).then(() => {
            setCopiedId(code);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const filteredLinks = links.filter(link =>
        (link.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (link.url || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <header>
                <div className="container header-content">
                    <h1>TinyLink</h1>
                    <ThemeToggle />
                </div>
            </header>
            <main className="container">
                <section className="create-link card">
                    <h2>Create New Link</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group flex-grow">
                                <label htmlFor="url">Destination URL</label>
                                <input
                                    type="url"
                                    id="url"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    placeholder="https://example.com/long-url"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="code">Custom Code (Optional)</label>
                                <input
                                    type="text"
                                    id="code"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    placeholder="e.g. mylink"
                                    pattern="[A-Za-z0-9]{6,8}"
                                    title="6-8 alphanumeric characters"
                                />
                            </div>
                        </div>
                        <button type="submit" disabled={submitting} className="btn-primary">
                            {submitting ? 'Shortening...' : 'Shorten URL'}
                        </button>
                        {message.text && (
                            <div className={`message ${message.type}`}>
                                {message.text}
                            </div>
                        )}
                    </form>
                </section>

                <section className="links-list card">
                    <div className="list-header">
                        <h2>Your Links</h2>
                        <input
                            type="text"
                            placeholder="Search by code or URL..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="table-responsive">
                        <table id="linksTable">
                            <thead>
                                <tr>
                                    <th>Short Code</th>
                                    <th>Original URL</th>
                                    <th>Clicks</th>
                                    <th>Last Clicked</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLinks.map(link => (
                                    <tr key={link.code}>
                                        <td>
                                            <div className="code-cell">
                                                <a href={`${BASE_URL}/${link.code}`} target="_blank" rel="noopener noreferrer" className="short-link">
                                                    {link.code}
                                                </a>
                                                <button
                                                    className="btn-icon copy-btn"
                                                    onClick={() => handleCopy(link.code)}
                                                    title="Copy Link"
                                                >
                                                    {copiedId === link.code ? <Check size={16} /> : <Copy size={16} />}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="url-cell" title={link.url}>{link.url}</td>
                                        <td>{link.clicks}</td>
                                        <td>{link.lastClickedAt ? new Date(link.lastClickedAt).toLocaleString() : '-'}</td>
                                        <td className="actions-cell">
                                            <Link to={`/stats?code=${link.code}`} className="btn-small btn-secondary">Stats</Link>
                                            <button
                                                className="btn-small btn-danger delete-btn"
                                                onClick={() => handleDelete(link.code)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {loading && <div className="text-center">Loading...</div>}
                        {!loading && error && <div className="text-center error">{error}</div>}
                        {!loading && filteredLinks.length === 0 && !error && (
                            <div className="text-center">No links created yet.</div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}
