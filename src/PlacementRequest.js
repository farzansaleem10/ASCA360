import React, { useState, useEffect } from 'react';
import './PlacementRequest.css'; // New CSS file
import backendUrl from './config';
import { Briefcase, GraduationCap, Check, X, Loader2 } from 'lucide-react';

const PlacementRequest = () => {
    const [activeTab, setActiveTab] = useState('work');
    const [pendingWorkReviews, setPendingWorkReviews] = useState([]);
    const [pendingPlacementReviews, setPendingPlacementReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    const fetchPendingReviews = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch both types of reviews in parallel for efficiency
            const [workRes, placementRes] = await Promise.all([
                fetch(`${backendUrl}/work-reviews/pending`),
                fetch(`${backendUrl}/placement-reviews/pending`)
            ]);

            if (!workRes.ok || !placementRes.ok) {
                throw new Error("Failed to fetch one or more review types. Ensure backend routes are correct.");
            }

            const workData = await workRes.json();
            const placementData = await placementRes.json();

            setPendingWorkReviews(workData);
            setPendingPlacementReviews(placementData);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingReviews();
    }, []);
    
    const handleStatusUpdate = async (reviewId, reviewType, newStatus) => {
        setMessage("");
        const url = reviewType === 'work' 
            ? `${backendUrl}/work-reviews/status/${reviewId}`
            : `${backendUrl}/placement-reviews/status/${reviewId}`;
            
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                // Refresh the list after an update
                fetchPendingReviews();
            } else {
                throw new Error(data.message || "Failed to update status.");
            }
        } catch (err) {
            setMessage(err.message);
        }
    };

    return (
        <div className="admin-placement-container">
            <header className="admin-placement-header">
                <h1>Review Approvals</h1>
                <p>Approve or reject reviews submitted by students and alumni.</p>
            </header>
            
             {message && <p className={`admin-form-message ${message.includes("approved") ? 'success' : 'error'}`}>{message}</p>}

            <div className="admin-placement-tabs">
                <button 
                  className={`admin-placement-tab ${activeTab === 'work' ? 'active' : ''}`}
                  onClick={() => setActiveTab('work')}
                >
                  <Briefcase size={18} /> Work Experience (Alumni)
                  {pendingWorkReviews.length > 0 && <span className="pending-badge">{pendingWorkReviews.length}</span>}
                </button>
                <button 
                  className={`admin-placement-tab ${activeTab === 'placement' ? 'active' : ''}`}
                  onClick={() => setActiveTab('placement')}
                >
                  <GraduationCap size={18} /> Placement Process (Students)
                   {pendingPlacementReviews.length > 0 && <span className="pending-badge">{pendingPlacementReviews.length}</span>}
                </button>
            </div>
            
            <main className="admin-placement-content">
                {loading && <div className="loader-container"><Loader2 className="animate-spin" /> <span>Loading pending reviews...</span></div>}
                {error && <div className="error-container"><p>{error}</p></div>}
                
                {activeTab === 'work' && !loading && (
                    <div className="review-list">
                        {pendingWorkReviews.length > 0 ? pendingWorkReviews.map(review => (
                            <div key={review._id} className="review-approval-card">
                                <h3>{review.companyName} - {review.jobTitle}</h3>
                                {!review.isAnonymous && <p className="author-info">By: {review.createdBy} (Batch: {review.batch})</p>}
                                <div className="review-details">
                                    <p><strong>Work-Life Balance:</strong> {review.workLifeBalance}/5</p>
                                    <p><strong>Culture:</strong> {review.cultureRating}/5</p>
                                </div>
                                <div className="approval-actions">
                                    <button className="approve-btn" onClick={() => handleStatusUpdate(review._id, 'work', 'Approved')}><Check size={16} /> Approve</button>
                                    <button className="reject-btn" onClick={() => handleStatusUpdate(review._id, 'work', 'Rejected')}><X size={16} /> Reject</button>
                                </div>
                            </div>
                        )) : <p className="empty-list-message">No pending work experience reviews.</p>}
                    </div>
                )}
                
                {activeTab === 'placement' && !loading && (
                     <div className="review-list">
                        {pendingPlacementReviews.length > 0 ? pendingPlacementReviews.map(review => (
                            <div key={review._id} className="review-approval-card">
                                <h3>{review.companyName} - {review.positionAppliedFor}</h3>
                                 {!review.isAnonymous && <p className="author-info">By: {review.createdBy} (Batch: {review.batch})</p>}
                                <div className="review-details">
                                    <p><strong>Final Offer:</strong> {review.finalOfferStatus || 'N/A'}</p>
                                    <p><strong>Rounds:</strong> {review.rounds.length}</p>
                                </div>
                                <div className="approval-actions">
                                     <button className="approve-btn" onClick={() => handleStatusUpdate(review._id, 'placement', 'Approved')}><Check size={16} /> Approve</button>
                                    <button className="reject-btn" onClick={() => handleStatusUpdate(review._id, 'placement', 'Rejected')}><X size={16} /> Reject</button>
                                </div>
                            </div>
                        )) : <p className="empty-list-message">No pending placement reviews.</p>}
                    </div>
                )}
            </main>
        </div>
    );
};

export default PlacementRequest;
