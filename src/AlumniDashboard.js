import React, { useState, useEffect } from 'react';
import './AlumniDashboard.css'; // We will create this CSS file
import backendUrl from './config';


const AlumniProfile = ({ alumniData }) => (
  <div className="dashboard-content">
    <div className="profile-header">
      <img 
        src={alumniData.photoUrl} 
        alt={`${alumniData.firstName} ${alumniData.lastName}`} 
        className="profile-picture"
        onError={(e) => { e.target.style.display = 'none'; }} // Hide if image fails to load
      />
      <div className="profile-header-info">
        <h2>{alumniData.firstName} {alumniData.lastName}</h2>
        <p className="profile-subheader">{alumniData.email}</p>
      </div>
    </div>
    <div className="profile-details">
      <h4>Contact & Links</h4>
      <p><strong>Graduation Year:</strong> {alumniData.graduationYear}</p>
      <p><strong>LinkedIn:</strong> <a href={alumniData.linkedin} target="_blank" rel="noopener noreferrer">{alumniData.linkedin}</a></p>
      <p><strong>GitHub:</strong> <a href={alumniData.github} target="_blank" rel="noopener noreferrer">{alumniData.github}</a></p>
      
      {alumniData.currentWorkplace && alumniData.currentWorkplace.institution &&
        <div className="work-section">
          <h4>Current Workplace</h4>
          <p>{alumniData.currentWorkplace.designation} at <strong>{alumniData.currentWorkplace.institution}</strong></p>
        </div>
      }
      
      {alumniData.experiences && alumniData.experiences.length > 0 &&
        <div className="work-section">
          <h4>Past Experience</h4>
          {alumniData.experiences.map((exp, index) => (
            <p key={index}>{exp.designation} at <strong>{exp.institution}</strong> ({exp.years})</p>
          ))}
        </div>
      }
    </div>
  </div>
);

// Sub-component for adding/editing announcements
const ManageAnnouncements = ({ alumniData }) => {
    const [myAnnouncements, setMyAnnouncements] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editingId, setEditingId] = useState(null);
    // Assuming backendUrl is configured, otherwise use relative paths
   

    // Fetch ALL announcements and filter them on the client-side
    const fetchAnnouncements = async () => {
        try {
        
            const response = await fetch(`${backendUrl}/announcement`);
            const allAnnouncements = await response.json();
            if(response.ok) {
                // Filter to show only announcements created by the logged-in alumnus
                const filtered = allAnnouncements.filter(ann => ann.createdBy === `${alumniData.firstName} ${alumniData.lastName}`);
                setMyAnnouncements(filtered);
            }
        } catch (error) {
            console.error("Failed to fetch announcements:", error);
        }
    };

    useEffect(() => {
        if(alumniData.firstName) fetchAnnouncements();
    }, [alumniData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingId ? `${backendUrl}/announcement/${editingId}` : `${backendUrl}/announcement`;
        const method = editingId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                // Send data in the format the backend expects
                body: JSON.stringify({ 
                    title, 
                    content, 
                    createdBy: `${alumniData.firstName} ${alumniData.lastName}`,
                })
            });
            if(response.ok) {
                fetchAnnouncements(); // Refresh the list
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
            if(response.ok) {
                fetchAnnouncements(); // Refresh the list
            }
        } catch (error) {
            console.error("Failed to delete announcement:", error);
        }
    };

    return (
        <div className="dashboard-content">
            <h2>{editingId ? 'Edit Announcement' : 'Add Announcement'}</h2>
            <form onSubmit={handleSubmit} className="announcement-form">
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required />
                <button type="submit">{editingId ? 'Update' : 'Add'} Announcement</button>
                {editingId && <button type="button" onClick={() => { setEditingId(null); setTitle(''); setContent(''); }}>Cancel Edit</button>}
            </form>

            <h2>Your Announcements</h2>
            <div className="announcements-list">
                {myAnnouncements.map(ann => (
                    <div key={ann._id} className="announcement-item">
                        <h3>{ann.title}</h3>
                        <p>{ann.content}</p>
                        <div className="announcement-actions">
                            <button onClick={() => handleEdit(ann)}>Edit</button>
                            <button onClick={() => handleDelete(ann._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// Main Alumni Dashboard Component (No changes needed here)
const AlumniDashboard = ({ userName, onLogout }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [alumniData, setAlumniData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${backendUrl}/alumni/profile/${userName}`);
        const data = await response.json();
        if (response.ok) {
          setAlumniData(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (userName) {
      fetchProfile();
    }
  }, [userName]);

  if (loading) {
    return <div>Loading Dashboard...</div>;
  }

  if (!alumniData) {
      return <div>Could not load profile data.</div>
  }

  return (
    <div className="alumni-dashboard-layout">
      <aside className="dashboard-sidebar">
        <h2>Alumni Portal</h2>
        <nav>
          <button onClick={() => setActiveSection('profile')} className={activeSection === 'profile' ? 'active' : ''}>Profile</button>
          <button onClick={() => setActiveSection('announcements')} className={activeSection === 'announcements' ? 'active' : ''}>Announcements</button>
        </nav>
        <button className="logout-button" onClick={onLogout}>Logout</button>
      </aside>
      <main className="dashboard-main-content">
        {activeSection === 'profile' && <AlumniProfile alumniData={alumniData} />}
        {activeSection === 'announcements' && <ManageAnnouncements alumniData={alumniData} />}
      </main>
    </div>
  );
};

export default AlumniDashboard;

