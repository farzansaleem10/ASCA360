import React, { useState, useEffect } from 'react';
import './ViewComplaint.css'; // Import the new CSS file

// Component for admins to view and manage complaints
const ViewComplaints = () => {
  // State to store the fetched complaints
  const [complaints, setComplaints] = useState([]);
  // State to manage the loading status while fetching data
  const [loading, setLoading] = useState(true);
  // State to handle any fetch errors
  const [error, setError] = useState(null);

  // Function to fetch all complaints from the backend
  const fetchComplaints = async () => {
    try {
      const response = await fetch('https://asca360.onrender.com/api/complaints');
      if (!response.ok) {
        throw new Error('Failed to fetch complaints. Check server connection.');
      }
      const data = await response.json();
      setComplaints(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to mark a complaint as completed
  const handleMarkAsComplete = async (id) => {
    try {
      const response = await fetch(`https://asca360.onrender.com/api/complaints/${id}`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Failed to mark complaint as complete.');
      }
      
      // Update the local state to reflect the change
      setComplaints(prevComplaints =>
        prevComplaints.map(c => 
          c._id === id ? { ...c, status: 'completed' } : c
        )
      );
    } catch (e) {
      console.error('Error marking complaint as complete:', e);
      setError('Failed to update complaint status.');
    }
  };

  // Fetch complaints when the component mounts
  useEffect(() => {
    fetchComplaints();
  }, []);

  // Show a loading message while data is being fetched
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card">
          Loading complaints...
        </div>
      </div>
    );
  }

  // Show an error message if the fetch fails
  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-card">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2 className="dashboard-title">
          Complaints Dashboard
        </h2>
        
        {complaints.length === 0 ? (
          <p className="dashboard-subtitle">
            No complaints have been filed yet.
          </p>
        ) : (
          <div className="complaints-table-container">
            <table className="complaints-table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Author</th>
                  <th className="table-header-cell">Complaint</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Action</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {complaints.map((complaint) => (
                  <tr key={complaint._id} className="table-row">
                    <td className="table-cell">{complaint.author}</td>
                    <td className="table-cell">{complaint.text}</td>
                    <td className="table-cell">
                      <span className={`status-badge status-${complaint.status}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="table-cell table-action-cell">
                      {/* Show the button only if the complaint is pending */}
                      {complaint.status !== 'completed' && (
                        <button
                          onClick={() => handleMarkAsComplete(complaint._id)}
                          className="action-button"
                        >
                          Mark as Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewComplaints;
