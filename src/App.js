import React, { useState } from 'react';
import StudentLogin from './StudentLogin';
import AscaLogin from './AscaLogin'; // New import
import AscaCommittee from './AscaCommittee'; // Existing import
import McaStudent from './McaStudent'; // Existing import
import Dashboard from './Dashboard';
import './login.css';

const App = () => {
  // State to track if a user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // State to store the logged-in user's name
  const [userName, setUserName] = useState('');
  // State to store the logged-in user's role
  const [userRole, setUserRole] = useState('');
  // New state to manage which form is currently visible
  const [activeForm, setActiveForm] = useState('student');

  // This function is passed to the login components as a prop.
  // It receives the user's name and role and updates the state.
  const handleLogin = (name, role) => {
    setIsLoggedIn(true);
    setUserName(name);
    setUserRole(role);
  };

  // This function is passed to the Dashboard component as a prop
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setUserRole('');
    // Reset to student login form on logout
    setActiveForm('student'); 
  };

  // Renders the correct login form based on the activeForm state
  const renderForm = () => {
    switch (activeForm) {
      case 'asca':
        // Pass the handleLogin function to each login component
        return <AscaLogin onLogin={handleLogin} />;
      case 'student':
        return <StudentLogin onLogin={handleLogin} />;
      case 'committee':
        return <AscaCommittee onLogin={handleLogin} />;
      case 'mca-student':
        return <McaStudent onLogin={handleLogin} />;
      default:
        return <StudentLogin onLogin={handleLogin} />;
    }
  };

  return (
    <div className="container">
      <div className="left-panel">
        <div className="logo-section">
          <div className="brand">ASCA360</div>
        </div>
        {/* Navigation menu to switch between login forms */}
        <div className="login-options">
          <div className="login-item" onClick={() => setActiveForm('asca')}>ASCA Login</div>
          <div className="login-item" onClick={() => setActiveForm('student')}>Student Login</div>
          <div className="login-item" onClick={() => setActiveForm('committee')}>Committee Login</div>
          <div className="login-item" onClick={() => setActiveForm('mca-student')}>MCA Students</div>
        </div>
      </div>
      <div className="right-panel">
        {/* Conditionally render the login form or the dashboard */}
        {!isLoggedIn ? (
          renderForm()
        ) : (
          <Dashboard userName={userName} userRole={userRole} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
};

export default App;
