import React, { useState, useEffect } from 'react';
import './FundPending.css';
import backendUrl from './config';

const FundPending = () => {
  // State to hold the list of fund requests
  const [requests, setRequests] = useState([]);
  // State to manage loading and error messages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to fetch all fund requests from the backend
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/funds`); // Your GET endpoint
      const data = await response.json();
      if (response.ok) {
        setRequests(data);
      } else {
        throw new Error(data.message || 'Failed to fetch requests.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect runs once when the component mounts to fetch the initial data
  useEffect(() => {
    fetchRequests();
  }, []);

  // Function to handle approving, rejecting, or completing a request
  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await fetch(`${backendUrl}/funds${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // If successful, update the request list to show the new status
        setRequests(prevRequests =>
          prevRequests.map(req =>
            req._id === id ? { ...req, status: status } : req
          )
        );
      } else {
        throw new Error(result.message || `Failed to update status.`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`); // Show an alert for update errors
    }
  };

  if (loading) return <p>Loading fund requests...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="fund-pending-container">
      <h1 className="fund-pending-title">Fund Requests</h1>
      {requests.length === 0 ? (
        <p>No fund requests found.</p>
      ) : (
        <div className="requests-list">
          {requests.map((req) => (
            <div key={req._id} className={`request-card status-${req.status}`}>
              <div className="card-header">
                <h3>{req.eventName}</h3>
                <span className={`status-badge status-${req.status}`}>{req.status}</span>
              </div>
              <div className="card-body">
                <p><strong>Student:</strong> {req.submittedBy}</p>
                <p><strong>Purpose:</strong> {req.purpose}</p>
                <p><strong>Amount:</strong> ₹{req.amount}</p>
                <p><strong>UPI ID:</strong> {req.upiId}</p>
                <p>
                  <strong>Proof:</strong>{' '}
                  <a href={req.proofLink} target="_blank" rel="noopener noreferrer">
                    View Receipt
                  </a>
                </p>
              </div>
              <div className="card-actions">
                {/* Only show Approve/Reject buttons if the request is pending */}
                {req.status === 'pending' && (
                  <>
                    <button
                      className="approve-btn"
                      onClick={() => handleUpdateStatus(req._id, 'approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleUpdateStatus(req._id, 'rejected')}
                    >
                      Reject
                    </button>
                  </>
                )}
                {/* --- NEW: Only show Mark as Complete if request is approved --- */}
                {req.status === 'approved' && (
                    <button
                        className="complete-btn"
                        onClick={() => handleUpdateStatus(req._id, 'completed')}
                    >
                        Mark as Complete
                    </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FundPending;

