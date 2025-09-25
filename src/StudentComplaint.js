import React, { useState } from 'react';
import './StudentComplaints.css'; // Using the new stylesheet
import backendUrl from './config';

const StudentComplaints = () => {
  // All existing state and logic is preserved
  const [complaintText, setComplaintText] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    // In a real app, user's name would come from auth state.
    const author = "Asca Student"; 
    
    try {
      const response = await fetch(`${backendUrl}/complaints`, { // Using backendUrl
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, text: complaintText }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message || "Complaint submitted successfully!");
        setComplaintText('');
      } else {
        setMessage(data.message || 'Failed to submit complaint.');
      }
    } catch (error) {
      console.error('Network Error:', error);
      setMessage('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // JSX is updated with new classNames for the fintech theme
  return (
    <div className="complaint-container">
      <div className="form-wrapper">
        <div className="form-header">
          <h1>File a Complaint</h1>
          <p>We are here to help. Please describe your issue below.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="complaint-form">
          <div className="form-group">
            <label htmlFor="complaintText">Your Complaint</label>
            <textarea
              id="complaintText"
              className="complaint-textarea"
              placeholder="Tell us what's on your mind..."
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              required
            ></textarea>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
        
        {message && (
          <p className="form-message">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentComplaints;
