import React, { useState } from "react";
import "./FundRequest.css";
import backendUrl from "./config";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
        setFormData({
          studentName: "",
          eventName: "",
          purpose: "",
          amount: "",
          upiId: "",
          proofLink: "",
        });
      } else {
        setMessage(result.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setMessage("A network error occurred. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fund-request-container">
      <div className="form-wrapper">
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
    </div>
  );
};

export default FundRequest;
