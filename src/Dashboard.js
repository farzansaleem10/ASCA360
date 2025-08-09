import React from 'react';

// A simple dashboard component to display after a successful login.
const Dashboard = ({ userName, userRole, onLogout }) => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        {/* The welcome message now uses the userName and userRole props. */}
        <h2>Welcome, {userName}!</h2>
        <p>You have successfully logged in as an **{userRole}**.</p>
        <button onClick={onLogout} className="logout-button">
          LOGOUT
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
