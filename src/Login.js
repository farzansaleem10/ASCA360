// src/Login.js
import React, { useState } from 'react';
import backendUrl  from './config';
import { Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');


  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        console.log('Login Success:', data.name, data.role);
        onLogin(data.name, data.role); // role will be "student" or "asca"
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
      <h2>Login</h2>
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
    <Link to="/alumni-register">Aluminee register</Link>
  </div>


        <button type="submit">LOGIN</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Login;
