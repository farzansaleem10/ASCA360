import React, { useState, useEffect } from "react";
import "./FundRequest.css";
import backendUrl from "./config";

// --- Status Tracker Component (No changes needed) ---
const StatusTracker = ({ status, rejectionReason }) => {
  const steps = ["pending", "approved", "completed"];
  const currentStepIndex = steps.indexOf(status);

  if (status === "rejected") {
    return (
      <div className="status-tracker rejected">
        <div className="status-step rejected">
          <div className="status-dot"></div>
          <div className="status-label">Rejected</div>
        </div>
        {rejectionReason && (
          <div className="rejection-reason-details">
            <strong>Admin's Reason:</strong> {rejectionReason}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="status-tracker">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className={`status-step ${index <= currentStepIndex ? "completed" : ""}`}>
            <div className="status-dot"></div>
            <div className="status-label">{step}</div>
          </div>
          {index < steps.length - 1 && <div className={`status-line ${index < currentStepIndex ? "completed" : ""}`}></div>}
        </React.Fragment>
      ))}
    </div>
  );
};


const FundRequest = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    eventName: "",
    purpose: "",
    amount: "",
    upiId: "",
    proofLink: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [myRequests, setMyRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // --- NEW: Separate state for the tracking name input ---
  const [trackName, setTrackName] = useState("");

  // Handler for the main submission form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // --- NEW: Separate handler for the tracking form ---
  const handleTrackNameChange = (e) => {
    setTrackName(e.target.value);
  };

  // Function to fetch requests based on the name in the tracking form
  const handleTrackRequest = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    if (!trackName) {
        setError("Please enter a name to track requests.");
        return;
    }
    setIsLoading(true);
    setError("");
    setMyRequests([]); // Clear previous results
    try {
        const response = await fetch(`${backendUrl}/funds/student/${encodeURIComponent(trackName)}`);
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Failed to fetch requests.");
        }
        const data = await response.json();
        setMyRequests(data);
    } catch (err) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    try {
      const submissionData = {
        eventName: formData.eventName,
        purpose: formData.purpose,
        amount: formData.amount,
        upiId: formData.upiId,
        proofLink: formData.proofLink,
        submittedBy: formData.studentName,
      };
      const response = await fetch(`${backendUrl}/funds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setMessage("Fund request submitted successfully!");
        // If the submitted name is the one being tracked, refresh the list
        if (trackName && formData.studentName === trackName) {
            handleTrackRequest(e);
        }
        setFormData({ studentName: "", eventName: "", purpose: "", amount: "", upiId: "", proofLink: "" });
      } else {
        setMessage(result.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      setMessage("A network error occurred. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
        <div className="fund-request-container">
      <div className="form-wrapper1" id="hehe">
        <div className="form-header">
          <h1>Fund Request</h1>
          <p>Submit expenditure details for reimbursement.</p>
        </div>
        <form className="fund-request-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="studentName">Student Name</label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="eventName">Event Name</label>
            <input
              type="text"
              id="eventName"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="purpose">Purpose of Expenditure</label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              rows="3"
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="upiId">UPI ID for Payment</label>
            <input
              type="text"
              id="upiId"
              name="upiId"
              value={formData.upiId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="proofLink">Reciept</label>
            <input
              type="url"
              id="proofLink"
              name="proofLink"
              value={formData.proofLink}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>
        {message && <p className="form-message">{message}</p>}
      </div>


   

      {/* --- TRACKING SECTION --- */}
      <div className="track-requests-section">
        <div className="form-header">
            <h2>Track Your Requests</h2>
        </div>
        {/* --- NEW, SEPARATE TRACKING FORM --- */}
        <form className="fund-request-form" onSubmit={handleTrackRequest}>
            <div className="form-group">
                <label htmlFor="trackName">Your Full Name *</label>
                <input 
                    type="text" 
                    id="trackName" 
                    name="trackName" 
                    value={trackName}
                    onChange={handleTrackNameChange} // Use the separate handler
                    required 
                    placeholder="Enter name to see past requests" 
                />
              </div>
            <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? "Searching..." : "Track Requests"}
            </button>
        </form>

        {isLoading && <p>Loading your requests...</p>}
        {error && <p className="form-message error">{error}</p>}
        
        <div className="requests-list-student">
          {myRequests.map((req) => (
            <div key={req._id} className="request-item-student">
              <div className="request-item-header">
                <h3>{req.eventName}</h3>
                <span>₹{req.amount.toLocaleString()}</span>
              </div>
              <p>Submitted on: {new Date(req.createdAt).toLocaleDateString('en-IN')}</p>
              <StatusTracker status={req.status} rejectionReason={req.rejectionReason} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FundRequest;

