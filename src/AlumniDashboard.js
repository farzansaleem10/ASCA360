import React, { useState, useEffect } from 'react';
import './AlumniDashboard.css'; // Using the new stylesheet
import backendUrl from './config';
import { User, Megaphone } from 'lucide-react';

// --- Sub-component for the Profile View ---
const AlumniProfile = ({ alumniData }) => (
    <div className="profile-content-card">
        <div className="profile-header">
            <img
                src={alumniData.photoUrl || `https://placehold.co/100x100/1C1C1C/FFFFFF?text=${alumniData.firstName.charAt(0)}`}
                alt={`${alumniData.firstName} ${alumniData.lastName}`}
                className="profile-picture"
                onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/100x100/1C1C1C/FFFFFF?text=${alumniData.firstName.charAt(0)}`; }}
            />
            <div className="profile-header-info">
                <h2>{alumniData.firstName} {alumniData.lastName}</h2>
                <p className="profile-subheader">{alumniData.email}</p>
            </div>
        </div>
        <div className="profile-details">
            <div className="detail-group">
                <h4>Contact & Links</h4>
                <p><strong>Graduation Year:</strong> {alumniData.graduationYear}</p>
                <p><strong>LinkedIn:</strong> <a href={alumniData.linkedin} target="_blank" rel="noopener noreferrer">{alumniData.linkedin}</a></p>
                <p><strong>GitHub:</strong> <a href={alumniData.github} target="_blank" rel="noopener noreferrer">{alumniData.github}</a></p>
            </div>

            {alumniData.currentWorkplace?.institution &&
                <div className="detail-group">
                    <h4>Current Workplace</h4>
                    <p>{alumniData.currentWorkplace.designation} at <strong>{alumniData.currentWorkplace.institution}</strong></p>
                </div>
            }

            {alumniData.experiences?.length > 0 &&
                <div className="detail-group">
                    <h4>Past Experience</h4>
                    {alumniData.experiences.map((exp, index) => (
                        <p key={index}>{exp.designation} at <strong>{exp.institution}</strong> ({exp.years})</p>
                    ))}
                </div>
            }
        </div>
    </div>
);

// --- Sub-component for adding/editing announcements ---
const ManageAnnouncements = ({ alumniData }) => {
    // All existing state and logic is preserved
    const [myAnnouncements, setMyAnnouncements] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editingId, setEditingId] = useState(null);

    const fetchAnnouncements = async () => {
        try {
            const response = await fetch(`${backendUrl}/announcement`);
            const allAnnouncements = await response.json();
            if (response.ok) {
                const filtered = allAnnouncements.filter(ann => ann.createdBy === `${alumniData.firstName} ${alumniData.lastName}`);
                setMyAnnouncements(filtered);
            }
        } catch (error) {
            console.error("Failed to fetch announcements:", error);
        }
    };

    useEffect(() => {
        if (alumniData.firstName) fetchAnnouncements();
    }, [alumniData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingId ? `${backendUrl}/announcement/${editingId}` : `${backendUrl}/announcement`;
        const method = editingId ? 'PUT' : 'POST';
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    createdBy: `${alumniData.firstName} ${alumniData.lastName}`,
                })
            });
            if (response.ok) {
                fetchAnnouncements();
                setTitle('');
                setContent('');
                setEditingId(null);
            }
        } catch (error) {
            console.error("Failed to save announcement:", error);
        }
    };

    const handleEdit = (announcement) => {
        setEditingId(announcement._id);
        setTitle(announcement.title);
        setContent(announcement.content);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${backendUrl}/announcement/${id}`, { method: 'DELETE' });
            if (response.ok) fetchAnnouncements();
        } catch (error) {
            console.error("Failed to delete announcement:", error);
        }
    };

    return (
        <div className="announcements-content-card">
            <div className="announcement-form-container">
                <h3>{editingId ? 'Edit Announcement' : 'Create Announcement'}</h3>
                <form onSubmit={handleSubmit} className="announcement-form">
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <textarea placeholder="Content..." value={content} onChange={(e) => setContent(e.target.value)} required />
                    <div className="form-actions">
                        {editingId && <button type="button" className="secondary-btn" onClick={() => { setEditingId(null); setTitle(''); setContent(''); }}>Cancel</button>}
                        <button type="submit" className="primary-btn">{editingId ? 'Update' : 'Add'}</button>
                    </div>
                </form>
            </div>

            <div className="announcements-list-container">
                <h3>Your Announcements</h3>
                <div className="announcements-list">
                    {myAnnouncements.length > 0 ? myAnnouncements.map(ann => (
                        <div key={ann._id} className="announcement-item">
                            <h4>{ann.title}</h4>
                            <p>{ann.content}</p>
                            <div className="announcement-actions">
                                <button onClick={() => handleEdit(ann)}>Edit</button>
                                <button onClick={() => handleDelete(ann._id)}>Delete</button>
                            </div>
                        </div>
                    )) : <p>You have not created any announcements.</p>}
                </div>
            </div>
        </div>
    );
};

// --- Main Alumni Dashboard Component ---
const AlumniDashboard = ({ userName, onLogout }) => {
    // All existing state and logic is preserved
    const [activeSection, setActiveSection] = useState('profile');
    const [alumniData, setAlumniData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${backendUrl}/alumni/profile/${userName}`);
                const data = await response.json();
                if (response.ok) setAlumniData(data);
            } catch (error) {
                console.error("Failed to fetch profile data:", error);
            } finally {
                setLoading(false);
            }
        };
        if (userName) fetchProfile();
    }, [userName]);

    if (loading) return <div className="dashboard-page-container">Loading Dashboard...</div>;
    if (!alumniData) return <div className="dashboard-page-container">Could not load profile data.</div>;

    return (
        <div className="dashboard-page-container">
            <header className="dashboard-header">
                <h2>Alumni Portal</h2>
                <button className="logout-btn" onClick={onLogout}>Logout</button>
            </header>

            <div className="dashboard-tabs">
                <button onClick={() => setActiveSection('profile')} className={`tab ${activeSection === 'profile' ? 'active' : ''}`}>
                    <User size={18} /> Profile
                </button>
                <button onClick={() => setActiveSection('announcements')} className={`tab ${activeSection === 'announcements' ? 'active' : ''}`}>
                    <Megaphone size={18} /> Announcements
                </button>
            </div>

            <main className="dashboard-main-content">
                {activeSection === 'profile' && <AlumniProfile alumniData={alumniData} />}
                {activeSection === 'announcements' && <ManageAnnouncements alumniData={alumniData} />}
            </main>
        </div>
    );
};

export default AlumniDashboard;
