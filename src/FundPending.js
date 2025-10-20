import React, { useState, useEffect } from "react";
import "./FundPending.css";
import backendUrl from "./config";

const FundPending = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- NEW STATE for managing the rejection modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/funds`);
      const data = await response.json();
      if (response.ok) {
        setRequests(data);
      } else {
        throw new Error(data.message || "Failed to fetch requests.");
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

  const handleUpdateStatus = async (id, status, reason = null) => {
    try {
      const bodyPayload = { status };
      if (status === 'rejected' && reason) {
        bodyPayload.rejectionReason = reason;
      }

      const response = await fetch(`${backendUrl}/funds/status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === id ? result.data : req
          )
        );
      } else {
        throw new Error(result.message || `Failed to update status.`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // --- NEW functions to control the modal ---
  const openRejectModal = (request) => {
    setCurrentRequest(request);
    setIsModalOpen(true);
  };

  const closeRejectModal = () => {
    setIsModalOpen(false);
    setCurrentRequest(null);
    setRejectionReason("");
  };

  const handleSubmitRejection = () => {
    if (!rejectionReason) {
      alert("Please provide a reason for rejection.");
      return;
    }
    handleUpdateStatus(currentRequest._id, "rejected", rejectionReason);
    closeRejectModal();
  };

  return (
    <>
      <div className="fund-pending-container">
        <header className="fund-pending-header">
          <h1>Fund Requests</h1>
          <p>Review, approve, or reject pending fund requests from students.</p>
        </header>

        <main className="fund-pending-content">
          {loading ? (
            <p className="status-message">Loading fund requests...</p>
          ) : error ? (
            <p className="status-message error">{error}</p>
          ) : requests.length === 0 ? (
            <p className="status-message">No fund requests found.</p>
          ) : (
            <div className="requests-list">
              {requests.map((req) => (
                <div
                  key={req._id}
                  className={`request-card status-${req.status.toLowerCase()}`}
                >
                  <div className="card-header">
                    <h3>{req.eventName}</h3>
                    <span className={`status-badge status-${req.status.toLowerCase()}`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="card-body">
                    <p><strong>Student:</strong> {req.submittedBy}</p>
                    <p><strong>Submitted on:</strong>{' '}{new Date(req.createdAt).toLocaleDateString('en-IN')}</p>
                    <p><strong>Amount:</strong> ₹{req.amount.toLocaleString()}</p>
                    <p><strong>UPI ID:</strong> {req.upiId}</p>
                    <p><strong>Purpose:</strong> {req.purpose}</p>
                    {req.status === 'rejected' && req.rejectionReason && (
                      <p className="rejection-reason">
                        <strong>Reason for Rejection:</strong> {req.rejectionReason}
                      </p>
                    )}
                    <p>
                      <strong>Proof:</strong>{" "}
                      <a href={req.proofLink} target="_blank" rel="noopener noreferrer" className="proof-link">
                        View Receipt
                      </a>
                    </p>
                  </div>
                  <div className="card-actions">
                    {req.status === "pending" && (
                      <>
                        <button
                          className="action-btn reject-btn "
                          // Updated to open the modal
                          onClick={() => openRejectModal(req)}
                        >
                          <span>Reject</span>
                        </button>
                        <button
                          className="action-btn approve-btn"
                          onClick={() => handleUpdateStatus(req._id, "approved")}
                        >
                          Approve
                        </button>
                      </>
                    )}
                    {req.status === "approved" && (
                      <button
                        className="action-btn complete-btn"
                        onClick={() => handleUpdateStatus(req._id, "completed")}
                      >
                        Mark as Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* --- NEW: Rejection Modal JSX --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Reason for Rejection</h2>
            <p>Please provide a reason for rejecting the fund request for <strong>{currentRequest.eventName}</strong>.</p>
            <textarea
              className="reason-textarea"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Insufficient details provided, budget exceeded..."
              rows="4"
            />
            <div className="modal-actions">
              <button className="action-btn" onClick={closeRejectModal}>
                Cancel
              </button>
              <button className="action-btn reject-btn" onClick={handleSubmitRejection}>
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FundPending;

