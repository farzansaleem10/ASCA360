import React, { useState, useEffect } from "react";
import "./FundPending.css";
import backendUrl from "./config";

const FundPending = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await fetch(`${backendUrl}/funds/status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === id ? { ...req, status: status } : req
          )
        );
      } else {
        throw new Error(result.message || `Failed to update status.`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
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
                className={`request-card status-${req.status}`}
              >
                <div className="card-header">
                  <h3>{req.eventName}</h3>
                  <span className={`status-badge status-${req.status}`}>
                    {req.status}
                  </span>
                </div>
                <div className="card-body">
                  <p>
                    <strong>Student:</strong> {req.submittedBy}
                  </p>
                  <p>
                      <strong>Submitted on:</strong>{' '}
                      {new Date(req.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  <p>
                    <strong>Amount:</strong> ₹{req.amount.toLocaleString()}
                  </p>
                  <p>
                    <strong>UPI ID:</strong> {req.upiId}
                  </p>
                  <p>
                    <strong>Purpose:</strong> {req.purpose}
                  </p>
                  <p>
                    <strong>Proof:</strong>{" "}
                    <a
                      href={req.proofLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="proof-link"
                    >
                      View Receipt
                    </a>
                  </p>
                </div>
                <div className="card-actions">
                  {req.status === "pending" && (
                    <>
                      <button
                        className="action-btn reject-btn "
                        onClick={() => handleUpdateStatus(req._id, "rejected")}
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
  );
};

export default FundPending;
