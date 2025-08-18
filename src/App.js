import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentLogin from './StudentLogin';
import AscaLogin from './AscaLogin';
import AscaCommittee from './AscaCommittee';
import McaStudent from './McaStudent';
import Dashboard from './Dashboard';
import StudentDashboard from './StudentDashboard';
import BalanceSheetDetails from './BalanceSheetDetails'; // <-- New details page
import AddEvent from './AddEvent'; // Or whatever you named it
import './login.css';
import ViewEvents from './ViewEvents';
import StudentComplaints from './StudentComplaint';
import ViewComplaints from './ViewComplaints'; // Import the complaints view component


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [activeForm, setActiveForm] = useState('student');

  const handleLogin = (name, role) => {
    setIsLoggedIn(true);
    setUserName(name);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setUserRole('');
    setActiveForm('student');
  };

  const renderForm = () => {
    switch (activeForm) {
      case 'asca':
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
    <Router>
      <div className="container">
        <div className="left-panel">
          <div className="logo-section">
            <div className="brand">ASCA360</div>
          </div>
          <div className="login-options">
            <div className="login-item" onClick={() => setActiveForm('asca')}>ASCA Login</div>
            <div className="login-item" onClick={() => setActiveForm('student')}>Student Login</div>
            <div className="login-item" onClick={() => setActiveForm('committee')}>Asca Committee</div>
            <div className="login-item" onClick={() => setActiveForm('mca-student')}>MCA Students</div>
          </div>
        </div>
        <div className="right-panel">
          <Routes>
            <Route
              path="/"
              element={
                !isLoggedIn ? (
                  renderForm()
                ) : (
                  userRole === "student" ? (
                    <StudentDashboard userName={userName} onLogout={handleLogout} />
                  ) : (
                    <Dashboard userName={userName} userRole={userRole} onLogout={handleLogout} />
                  )
                )
              }
            />
            <Route path="/balance-sheet" element={<BalanceSheetDetails />} />
             <Route path="/events-admin" element={<AddEvent />} />
             <Route path="/events" element={<ViewEvents />} />
             <Route path="/file-complaint" element={<StudentComplaints />} />
             <Route path="/view-complaint" element={<ViewComplaints />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;