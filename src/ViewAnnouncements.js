import React, { useState, useEffect } from 'react';
import './ViewAnnouncement.css'; // Using the new stylesheet
import backendUrl from './config';

const ViewAnnouncements = () => {
  // All existing state and logic is preserved
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`${backendUrl}/announcement`);
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

  // JSX is updated with new classNames for the fintech theme
  return (
    <div className="announcements-container">
      <header className="announcements-header">
        <h1>Announcements</h1>
        <p>Stay updated with the latest news and information.</p>
      </header>

      <main className="announcements-content">
        {loading ? (
          <p className="status-message">Loading announcements...</p>
        ) : error ? (
          <p className="status-message error">Error: {error}</p>
        ) : announcements.length === 0 ? (
          <p className="status-message">No announcements to display.</p>
        ) : (
          <div className="announcements-list">
            {announcements.map((announcement) => (
              <div key={announcement._id} className="announcement-item">
                <h3 className="announcement-item-title">
                  {announcement.title}
                </h3>
                <p className="announcement-item-content">
                  {announcement.content}
                </p>
                <div className="announcement-item-meta">
                  - Posted by {announcement.createdBy} on {new Date(announcement.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewAnnouncements;
