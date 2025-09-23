import React, { useState, useEffect } from 'react'; // <-- Import useEffect
import { BrowserRouter as Router, Routes, Route,useLocation } from 'react-router-dom';
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
import FundRequest from './FundRequest';
import AlumniRegister from './AlumniRegister';






const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [activeForm, setActiveForm] = useState('student');

  // --- NEW CODE START ---
   const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    // Listen for the browser's install prompt event
    const handler = (e) => {
      e.preventDefault(); // Prevent the default mini-infobar from appearing
      console.log("Install prompt event captured.");
      setInstallPrompt(e); // Save the event so it can be triggered later
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) {
      return;
    }
    // Show the browser's installation prompt
    installPrompt.prompt();
    // Wait for the user to respond
    installPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setInstallPrompt(null); // Clear the prompt once it's been used
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
//       case 'committee':
//         return <AscaCommittee onLogin={handleLogin} />;
      case 'mca-student':
        return <McaStudent onLogin={handleLogin} />;
      default:
        return <StudentLogin onLogin={handleLogin} />;
    }
  };

  return (
  
    <Router>
   
      {installPrompt && (
        <div className="install-app-card-container">
            <div className="install-app-card">
                <div className="install-app-card__header">
                    <div className="install-app-card__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                    </div>
                    <h3 className="install-app-card__title">Install ASCA360</h3>
                    <button className="install-app-card__close" onClick={() => setInstallPrompt(null)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div className="install-app-card__body">
                    <p className="install-app-card__content">Install our app for a better experience and quick launch.</p>
                </div>
                <div className="install-app-card__actions">
                    <button className="install-app-card__button install-app-card__button--secondary" onClick={() => setInstallPrompt(null)}>Later</button>
                    <button className="install-app-card__button install-app-card__button--primary" onClick={handleInstallClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        <span>Install App</span>
                    </button>
                </div>
            </div>
        </div>
      )}
      {/* --- NEW CODE END --- */}

     
       
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
            <Route path="/asca-committee" element={<AscaCommittee />} />
            <Route path="/fundrequest" element={<FundRequest />} />
             <Route path="/alumni-register" element={<AlumniRegister />} />
          </Routes>
        </div>
     
    </Router>
  );
};

export default App;
