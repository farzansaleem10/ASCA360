import React, { useState, useEffect } from 'react';
import './AlumniRequests.css'; // Using the new stylesheet
import backendUrl from './config';

const AlumniRequests = () => {
    // All existing state and logic is preserved
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchRequests = async () => {
        try {
            setLoading(true);
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

    const handleUpdateRequest = async (id, status) => {
        try {
            // Corrected API endpoint for updating status
            const response = await fetch(`${backendUrl}/alumni/status/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            const result = await response.json();
            if (response.ok && result.success) {
                setRequests(prevRequests => prevRequests.filter(req => req._id !== id));
            } else {
                throw new Error(result.message || 'Failed to update status.');
            }
        } catch (err) {
            alert(`Error: ${err.message}`); // Simple alert for now
        }
    };

    // The JSX is updated to use the new theme and classNames
    return (
        <div className="alumni-requests-container">
            <header className="alumni-requests-header">
                <h1>Pending Alumni Registrations</h1>
                <p>Review and approve or reject new alumni requests.</p>
            </header>

            {loading && <p className="loading-message">Loading alumni requests...</p>}
            {error && <p className="error-message">{error}</p>}
            
            {!loading && !error && (
                requests.length === 0 ? (
                    <p className="no-requests-message">No pending registrations found.</p>
                ) : (
                    <div className="requests-grid">
                        {requests.map(req => (
                            <div key={req._id} className="request-card">
                                <div className="card-content">
                                    <h3>{req.firstName} {req.lastName}</h3>
                                    <p><strong>Graduation Year:</strong> {req.graduationYear}</p>
                                    <p><strong>Email:</strong> {req.email}</p>
                                    <a href={req.pgCertificateUrl} target="_blank" rel="noopener noreferrer" className="certificate-link">
                                        View PG Certificate
                                    </a>
                                </div>
                                <div className="card-actions">
                                    <button
                                        className="action-btn approve-btn"
                                        onClick={() => handleUpdateRequest(req._id, 'approved')}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="action-btn reject-btn"
                                        onClick={() => handleUpdateRequest(req._id, 'rejected')}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default AlumniRequests;
