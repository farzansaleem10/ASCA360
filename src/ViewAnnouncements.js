import React, { useState, useEffect } from 'react';
import './ViewAnnouncement.css';

// Component for all users to view announcements
const ViewAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/announcement');
      if (!response.ok) {
        throw new Error('Failed to fetch announcements. Check server connection.');
      }
      const data = await response.json();
      setAnnouncements(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <div className="message-container">
        <div className="message-card">
          Loading announcements...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="message-container">
        <div className="message-card error-message">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="announcements-container">
      <div className="announcements-card">
        <h2 className="announcements-title">
          Announcements
        </h2>
        
        {announcements.length === 0 ? (
          <p className="announcements-subtitle">
            No announcements to display.
          </p>
        ) : (
          <div className="announcements-list">
            {announcements.map((announcement) => (
              <div key={announcement._id} className="announcement-item">
                <h3 className="announcement-title-item">
                  {announcement.title}
                </h3>
                <p className="announcement-content">
                  {announcement.content}
                </p>
                <div className="announcement-meta">
                  - {announcement.createdBy} on {new Date(announcement.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAnnouncements;
