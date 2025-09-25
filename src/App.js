import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./Login";
import AscaCommittee from "./AscaCommittee";
import Dashboard from "./Dashboard";
import StudentDashboard from "./StudentDashboard";
import BalanceSheetDetails from "./BalanceSheetDetails";
import AddEvent from "./AddEvent";
import "./login.css";
import ViewEvents from "./ViewEvents";
import StudentComplaints from "./StudentComplaint";
import ViewComplaints from "./ViewComplaints";
import CreateAnnouncement from "./CreateAnnouncement";
import ViewAnnouncements from "./ViewAnnouncements";
import Academics from "./Academics";
import Semester1 from "./Semester1";
import FundRequest from "./FundRequest";
import AlumniRegister from "./AlumniRegister";
import FundPending from "./FundPending";
import AlumniRequests from "./AlumniRequest";
import Community from "./Community";
import AlumniLogin from "./AlumniLogin";
import AlumniDashboard from "./AlumniDashboard";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleLogin = (name, role) => {
    setIsLoggedIn(true);
    setUserName(name);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setUserRole("");
  };
  const renderForm = () => <Login onLogin={handleLogin} />;
  const renderDashboard = () => {
    switch (userRole) {
      case "alumni":
        return <AlumniDashboard userName={userName} onLogout={handleLogout} />;
      case "student":
      case "mca-student":
        return <StudentDashboard userName={userName} onLogout={handleLogout} />;
      case "asca":
      case "committee":
        return (
          <Dashboard
            userName={userName}
            userRole={userRole}
            onLogout={handleLogout}
          />
        );
      default:
        // If logged in but role is unknown, redirect to the main login
        return <Navigate to="/login" />;
    }
  };

  return (
    <Router>
      <div className="container">
        <div className="right-panel">
          <Routes>
            <Route
              path="/"
              element={!isLoggedIn ? renderForm() : renderDashboard()}
            />
            <Route
              path="/alumni-login"
              element={
                !isLoggedIn ? (
                  <AlumniLogin onLogin={handleLogin} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/alumni-dashboard"
              element={
                <AlumniDashboard userName={userName} onLogout={handleLogout} />
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
            <Route path="/fundpending" element={<FundPending />} />
            <Route path="/alumni-register" element={<AlumniRegister />} />
            <Route path="/alumnirequest" element={<AlumniRequests />} />
            <Route path="/community" element={<Community />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
