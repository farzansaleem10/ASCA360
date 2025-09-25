import React, { useState } from 'react';
// Assuming 'backendUrl' is configured in a config file. If not, you can replace this.
 import backendUrl from './config';


import { Link, useNavigate, useLocation } from 'react-router-dom';
import './login.css'; // Make sure this CSS file is imported

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get the current URL path to set the active tab

  // --- Core Login Logic (Unchanged) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Login Success:', data.name, data.role);
        if (onLogin) {
            onLogin(data.name, data.role); // role will be "student" or "asca"
        }
      } else {
        setMessage(data.message || 'Invalid credentials.');
      }
    } catch (error) {
      console.error('Network Error:', error);
      setMessage('A network error occurred. Please try again.');
    }
  };
  // --- End of Unchanged Logic ---

  // Determine which tab is active based on the current route
  const isStudentLogin = location.pathname === '/';
  const isAlumniLogin = location.pathname === '/alumni-login';

  return (
    <div className="login-page-container">
      <div className="login-form-wrapper">
        <div className="form-tabs">
          <button
            className={`tab ${isStudentLogin ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            Student
          </button>
          <button
            className={`tab ${isAlumniLogin ? 'active' : ''}`}
            onClick={() => navigate('/alumni-login')}
          >
            Alumni
          </button>
        </div>
        <div className="form-box">
          <h2>{isAlumniLogin ? 'Alumni Login' : 'Student Login'}</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            
            <div className="forgot">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button type="submit">LOGIN</button>
          </form>
          {message && <p className="message">{message}</p>}
           {/* <div className="signup-link">
                <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
            </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;

