import React, { useState } from 'react';
import './ForgotPassword.css'; // Import the new CSS file
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  // State to manage which step of the process we are on
  const [step, setStep] = useState('email'); // 'email', 'otp', 'reset'
  
  // State for form inputs
  const [email, setEmail] = useState('farzansaleem782@gmail.com');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State for loading and messages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // --- Step 1: Handle sending the OTP ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // --- MOCK API CALL ---
    // In a real app, you would fetch your backend here:
    // await fetch(`${backendUrl}/auth/send-otp`, { method: 'POST', body: JSON.stringify({ email }) });
    console.log(`Sending OTP to ${email}`);
    setTimeout(() => {
      setLoading(false);
      setMessage(`An OTP has been sent to ${email}.`);
      setStep('otp'); // Move to the next step
    }, 1500);
  };

  // --- Step 2: Handle verifying the OTP ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // --- MOCK API CALL ---
    // In a real app, you would verify the OTP with your backend
    console.log(`Verifying OTP: ${otp}`);
    setTimeout(() => {
      setLoading(false);
      if (otp === '123456') { // Mocking a correct OTP
        setMessage('OTP verified successfully. Please set a new password.');
        setStep('reset'); // Move to the final step
      } else {
        setError('Invalid OTP. Please try again.');
      }
    }, 1500);
  };
  
  // --- Step 3: Handle resetting the password ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');

    // --- MOCK API CALL ---
    // In a real app, you would send the email, otp, and newPassword to your backend
    console.log(`Resetting password for ${email}`);
    setTimeout(() => {
      setLoading(false);
      setMessage('Your password has been reset successfully!');
      // Redirect to login page after a short delay
      setTimeout(() => navigate('/login'), 2000); 
    }, 1500);
  };

  // --- Render different forms based on the current step ---
  const renderFormStep = () => {
    switch (step) {
      // --- Case 1: Email Form ---
      case 'email':
        return (
          <form onSubmit={handleSendOtp}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        );
      
      // --- Case 2: OTP Form ---
      case 'otp':
        return (
          <form onSubmit={handleVerifyOtp}>
            <label htmlFor="otp">Enter OTP</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the 6-digit OTP"
              required
            />
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        );

      // --- Case 3: Reset Password Form ---
      case 'reset':
        return (
          <form onSubmit={handleResetPassword}>
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              required
            />
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              required
            />
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="forgot-password-container">
      <Link to="/login" className="back-button">
        <ArrowLeft size={16} /> Back to Home
      </Link>
      <div className="form-wrapper">
        <header className="form-header">
          <h2>Forgot Password</h2>
          <p>
            {step === 'email' && 'Enter your email address to receive a password reset link.'}
            {step === 'otp' && `We've sent an OTP to ${email}. Please enter it below.`}
            {step === 'reset' && 'Please enter and confirm your new password.'}
          </p>
        </header>

        {renderFormStep()}

        {/* Display success or error messages */}
        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
