import React, { useState } from 'react';
import './CreateAnnouncement.css';

// Component for admins to create a new announcement
const CreateAnnouncement = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    // In a real app, you would get the user's name from authentication state.
    const createdBy = "Asca Admin"; // Hardcoded for this example
    const payload = {
        title,
        content,
        createdBy
    };

    // Log the payload to the console to verify the data being sent
    console.log('Sending payload to backend:', payload);
    
    try {
      const response = await fetch('http://localhost:5000/api/announcement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message);
        setTitle('');
        setContent('');
      } else {
        setMessage(data.message || 'Failed to create announcement.');
      }
    } catch (error) {
      console.error('Network Error:', error);
      setMessage('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="announcement-container">
      <div className="announcement-card">
        <h2 className="announcement-title">
          Create Announcement
        </h2>
        <p className="announcement-subtitle">
          Share important news with your community.
        </p>
        
        <form onSubmit={handleSubmit} className="announcement-form">
          <div>
            <label htmlFor="title" className="announcement-label">Title</label>
            <input
              type="text"
              id="title"
              className="announcement-input"
              placeholder="e.g., Upcoming Holiday"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="announcement-label">Content</label>
            <textarea
              id="content"
              className="announcement-textarea"
              placeholder="Write your announcement here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Publishing...' : 'Publish Announcement'}
          </button>
        </form>
        
        {message && (
          <p className={`announcement-message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateAnnouncement;
