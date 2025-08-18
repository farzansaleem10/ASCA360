import React, { useState } from 'react';
import './StudentComplaints.css';

// This component now contains the form for students to file a complaint.
const StudentComplaints = () => {
  // State to hold the user's complaint text
  const [complaintText, setComplaintText] = useState('');
  // State for displaying success, error, or loading messages
  const [message, setMessage] = useState('');
  // State to track if the form is currently submitting
  const [loading, setLoading] = useState(false);

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    // Prevent the default form submission to avoid a page reload
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    // In a real application, the user's name would come from the logged-in state.
    // We are hardcoding it here to match the backend logic for this example.
    const author = "Asca Student";
    
    try {
      // Make a POST request to the backend's complaints endpoint
      const response = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, text: complaintText }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // If the response is successful, display a success message and clear the form
        setMessage(data.message);
        setComplaintText('');
      } else {
        // If the response is not OK, display the error message from the backend
        setMessage(data.message || 'Failed to submit complaint.');
      }
    } catch (error) {
      console.error('Network Error:', error);
      setMessage('A network error occurred. Please try again.');
    } finally {
      // Set loading to false once the request is complete
      setLoading(false);
    }
  };

  return (
    <div className="complaint-container">
      <div className="complaint-card">
        <h2 className="complaint-title">
          File a Complaint
        </h2>
        <p className="complaint-subtitle">
          We are here to help. Please describe your issue below.
        </p>
        
        <form onSubmit={handleSubmit} className="complaint-form">
          <textarea
            className="complaint-textarea"
            placeholder="Tell us what's on your mind..."
            value={complaintText}
            onChange={(e) => setComplaintText(e.target.value)}
            required
          ></textarea>
          
          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
        
        {message && (
          <p className={`complaint-message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentComplaints;
