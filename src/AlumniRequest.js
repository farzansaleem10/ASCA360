import React, { useState, useEffect } from 'react';
import './AlumniRequests.css'; // We will create this CSS file next
import backendUrl from './config';

const AlumniRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to fetch pending alumni registrations
  const fetchRequests = async () => {
    try {
      setLoading(true);
      // This new backend endpoint will fetch only pending registrations
      const response = await fetch(`${backendUrl}/alumni/pending`); 
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

  useEffect(() => {
    fetchRequests();
  }, []);

  // Function to handle approving or rejecting a registration
  const handleUpdateRequest = async (id, status) => {
    try {
      const response = await fetch(`/api/alumni/status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        // If successful, remove the approved/rejected user from the list
        setRequests(prevRequests => prevRequests.filter(req => req._id !== id));
      } else {
        throw new Error(result.message || 'Failed to update status.');
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <p>Loading alumni requests...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="alumni-requests-container">
      <h1 className="alumni-requests-title">Pending Alumni Registrations</h1>
      {requests.length === 0 ? (
        <p>No pending registrations found.</p>
      ) : (
        <div className="requests-grid">
          {requests.map(req => (
            <div key={req._id} className="request-item-card">
              <div className="card-content">
                <p><strong>Name:</strong> {req.firstName} {req.lastName}</p>
                <p><strong>Graduation Year:</strong> {req.graduationYear}</p>
                <p><strong>Email:</strong> {req.email}</p>
                <p>
                  <strong>PG Certificate:</strong>{' '}
                  <a href={req.pgCertificateUrl} target="_blank" rel="noopener noreferrer">
                    View Certificate
                  </a>
                </p>
              </div>
              <div className="card-action-buttons">
                <button
                  className="approve-action-btn"
                  onClick={() => handleUpdateRequest(req._id, 'approved')}
                >
                  Approve
                </button>
                <button
                  className="reject-action-btn"
                  onClick={() => handleUpdateRequest(req._id, 'rejected')}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlumniRequests;
