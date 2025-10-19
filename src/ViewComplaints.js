import React, { useState, useEffect } from "react";
import "./ViewComplaint.css";
import backendUrl from "./config";

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComplaints = async () => {
    try {
      const response = await fetch(`${backendUrl}/complaints`);
      if (!response.ok) {
        throw new Error("Failed to fetch complaints. Check server connection.");
      }
      const data = await response.json();
      setComplaints(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsComplete = async (id) => {
    try {
      const response = await fetch(`${backendUrl}/complaints/${id}`, {
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error("Failed to mark complaint as complete.");
      }
      setComplaints((prevComplaints) =>
        prevComplaints.map((c) =>
          c._id === id ? { ...c, status: "completed" } : c
        )
      );
    } catch (e) {
      console.error("Error marking complaint as complete:", e);
      setError("Failed to update complaint status.");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="view-complaints-container">
      <header className="complaints-header">
        <h1>Complaints Dashboard</h1>
        <p>Review and manage all submitted student complaints.</p>
      </header>

      <main className="complaints-content">
        {loading ? (
          <p className="status-message">Loading complaints...</p>
        ) : error ? (
          <p className="status-message error">Error: {error}</p>
        ) : complaints.length === 0 ? (
          <p className="status-message">No complaints have been filed yet.</p>
        ) : (
          <div className="table-container">
            <table className="complaints-table">
              <thead>
                <tr>
                  <th>Author</th>
                  <th>Complaint</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint._id}>
                    <td>{complaint.author}</td>
                    <td className="complaint-text-cell">{complaint.text}</td>
                    <td>
                      <span
                        className={`status-badge status-${complaint.status}`}
                      >
                        {complaint.status}
                      </span>
                    </td>
                    <td>
                      {complaint.status !== "completed" && (
                        <button
                          onClick={() => handleMarkAsComplete(complaint._id)}
                          className="action-btn"
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
      </main>
    </div>
  );
};

export default ViewComplaints;
