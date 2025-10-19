import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./login.css";
import backendUrl from "./config";
import AuthLayout from "./AuthLayout";

const AlumniLogin = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${backendUrl}/alumni/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        if (onLogin) {
          onLogin(data.name, data.role);
        }
      } else {
        setMessage(
          data.message || "Invalid credentials or registration not approved."
        );
      }
    } catch (error) {
      console.error("Network Error during alumni login:", error);
      setMessage("A network error occurred. Please try again.");
    }
  };

  const isStudentLogin = location.pathname === "/";
  const isAlumniLogin = location.pathname === "/alumni-login";

  return (
    <AuthLayout>
      <div className="login-page-container">
        <div className="login-form-wrapper">
          <div className="form-tabs">
            <button
              className={`tab ${isStudentLogin ? "active" : ""}`}
              onClick={() => navigate("/")}
            >
              Student
            </button>
            <button
              className={`tab ${isAlumniLogin ? "active" : ""}`}
              onClick={() => navigate("/alumni-login")}
            >
              Alumni
            </button>
          </div>
          <div className="form-box">
            <h2>Alumni Login</h2>
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label htmlFor="alumni-email">Email Address</label>
                <input
                  id="alumni-email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="alumni-password">Password</label>
                <input
                  id="alumni-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="alumni-link-container">
                <Link to="/alumni-register">Alumni Register</Link>
                <Link to="/forgot-password">Forgot password?</Link>
              </div>

              <button type="submit">LOGIN</button>
            </form>
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default AlumniLogin;
