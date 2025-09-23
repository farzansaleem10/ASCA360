import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// This component now accepts an 'onLogin' prop to handle a successful login.
const StudentLogin = ({ onLogin }) => {
  // State for email and password inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State for displaying success or error messages to the user
  const [message, setMessage] = useState('');

  // Handler for form submission
  const handleLogin = async (e) => {
    // Prevents the default browser form submission behavior
    e.preventDefault();
    setMessage('');
    
    try {
      const response = await fetch('https://asca360.onrender.com/api/student-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Now, we call the onLogin prop and pass both the user's name and role,
        // which are received from the backend response.
        onLogin(data.name, data.role);
      } else {
        setMessage(data.message || 'Invalid student credentials.');
      }

    } catch (error) {
      console.error('Network Error during login:', error);
      setMessage('A network error occurred. Please try again.');
    }
  };

  return (
    <div className="form-box">
      <h2> Login</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email Address" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password"
          placeholder="Password" 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* --- NEW CODE START --- */}
    <div className="alumni-link-container">
      <Link to="/alumni-register">Aluminee register</Link>
    </div>
    {/* --- NEW CODE END --- */}
        <button type="submit">LOGIN</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default StudentLogin;
