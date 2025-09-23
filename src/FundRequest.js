import React, { useState } from 'react';
import './FundRequest.css';

// The component no longer needs the userName prop
const FundRequest = () => {
  const [formData, setFormData] = useState({
    studentName: '', // New field for the student's name
    eventName: '',
    purpose: '',
    amount: '',
    upiId: '',
    proofLink: '',
  });
  const [message, setMessage] = useState('');
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
    setMessage('');

    try {
      // The backend expects a 'submittedBy' field, which now comes from the form
      const submissionData = {
        eventName: formData.eventName,
        purpose: formData.purpose,
        amount: formData.amount,
        upiId: formData.upiId,
        proofLink: formData.proofLink,
        submittedBy: formData.studentName, // Using the name from the new input field
      };

      const response = await fetch('https://asca360.onrender.com/api/fund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage('Fund request submitted successfully!');
        // Reset the form after successful submission
        setFormData({
          studentName: '',
          eventName: '',
          purpose: '',
          amount: '',
          upiId: '',
          proofLink: '',
        });
      } else {
        setMessage(result.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      setMessage('A network error occurred. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fund-request-wrapper">
      <div className="fund-request-container">
        <h1 className="fund-request-title">Fund Request</h1>
        <p className="fund-request-subtitle">
          Submit the details of the expenditure for reimbursement.
        </p>
        <form className="fund-request-form" onSubmit={handleSubmit}>
          {/* New input field for Student Name */}
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
            <label htmlFor="proofLink">Proof Link (e.g., Google Drive)</label>
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
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
        {message && <p className="success-message">{message}</p>}
      </div>
    </div>
  );
};

export default FundRequest;

