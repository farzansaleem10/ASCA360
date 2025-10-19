import React from "react";
import "./AuthLayout.css";

const AuthLayout = ({ children, showHeading = true }) => {
  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {showHeading && (
          <header className="auth-header">
            <h1>ASCA 360</h1>
            <p>Connecting Students & Alumni. Empowering Community.</p>
          </header>
        )}
        <main className="auth-content">{children}</main>
      </div>
    </div>
  );
};

export default AuthLayout;
