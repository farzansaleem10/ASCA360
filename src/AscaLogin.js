import React, { useState } from 'react';

// This component now accepts an 'onLogin' prop to handle a successful login.
const AscaLogin = ({ onLogin }) => {
  // State to hold the user's email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State for displaying success or error messages to the user
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    // Prevent the default form submission that causes a page reload
    e.preventDefault(); 
    
    // Clear any previous messages
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('Login Success:', data.name, data.role);
        // On successful login, we call the `onLogin` function from props
        // and pass the user's name and role back to the parent component (App.js).
        onLogin(data.name, data.role);
      } else {
        setMessage(data.message || 'Invalid credentials.');
      }
    } catch (error) {
      console.error('Network Error:', error);
      setMessage('A network error occurred. Please try again.');
    }
  };

  return (
    <div className="form-box">
      <h2>Asca Login</h2>
      {/* Attach the handleLogin function to the form's onSubmit event */}
      <form onSubmit={handleLogin}>
        {/* Use 'value' and 'onChange' to connect this input to the email state */}
        <input 
          type="email" 
          placeholder="Email Address" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* Use 'value' and 'onChange' to connect this input to the password state */}
        <input 
          type="password" 
          placeholder="Password" 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">LOGIN</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AscaLogin;
