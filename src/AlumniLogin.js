import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import './login.css';
import backendUrl from './config';

const AlumniLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
    const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // This new endpoint handles alumni login
      const response = await fetch(`${backendUrl}/alumni/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();

      
      if (data.success) {
        onLogin(data.name, data.role);
      } else {
        setMessage(data.message || 'Invalid credentials or registration not approved.');
      }

    } catch (error) {
      console.error('Network Error during alumni login:', error);
      setMessage('A network error occurred. Please try again.');
    }
  };

  return (
   
        <div className="login-form-wrapper">
            <div className="form-tabs">
              <button
                className="tab"
                onClick={() => navigate('/')}
              >
                Student
              </button>
              <button
              
                className="tab"
                onClick={() => navigate('/alumni-login')}
              >    
                Alumni
              </button>
            </div>
    <div className="form-box">
      <h2>Alumni Login</h2>
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
        <div className="alumni-link-container">
            <Link to="/alumni-register">Alumni Register</Link>
            <Link to="/alumni-register">Forgot password?</Link>
        </div>
        
        <button type="submit">LOGIN</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
        </div>
       
  );
};

export default AlumniLogin;
