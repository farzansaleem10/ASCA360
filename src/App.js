import React, { useState, useEffect } from 'react'; // <-- Import useEffect
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentLogin from './StudentLogin';
import AscaLogin from './AscaLogin';
import AscaCommittee from './AscaCommittee';
import McaStudent from './McaStudent';
import Dashboard from './Dashboard';
import StudentDashboard from './StudentDashboard';
import BalanceSheetDetails from './BalanceSheetDetails';
import AddEvent from './AddEvent';
import './login.css';
import ViewEvents from './ViewEvents';
import StudentComplaints from './StudentComplaint';
import ViewComplaints from './ViewComplaints';
import CreateAnnouncement from './CreateAnnouncement';
import ViewAnnouncements from './ViewAnnouncements';
import Academics from './Academics';
import Semester1 from './Semester1';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [activeForm, setActiveForm] = useState('student');

  // --- NEW CODE START ---
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      console.log("Install prompt event captured.");
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) {
      return;
    }
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setInstallPrompt(null); // Clear the prompt once used
      });
  };
  // --- NEW CODE END ---

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
    // ... (your existing renderForm function, no changes needed)
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
      {/* --- NEW CODE START --- */}
      {installPrompt && (
        <div className="custom-install-popup">
          <div className="popup-content">
             <div className="popup-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                <h3>Install ASCA360</h3>
             </div>
             <p>Install our app for a better experience and quick launch.</p>
             <div className="popup-buttons">
               <button className="popup-install-btn" onClick={handleInstallClick}>Install App</button>
               <button className="popup-later-btn" onClick={() => setInstallPrompt(null)}>Later</button>
             </div>
          </div>
        </div>
      )}
      {/* --- NEW CODE END --- */}

      <div className="container">
        <div className="left-panel">
          {/* ... (rest of your existing JSX, no changes needed) */}
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
             <Route path="/add-announcement" element={<CreateAnnouncement />} />
             <Route path="/view-announcement" element={<ViewAnnouncements />} />
             <Route path="/academics" element={<Academics />} />
             <Route path="/semester-1" element={<Semester1 />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
