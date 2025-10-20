import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";

import Login from "./Login";
import AscaCommittee from "./AscaCommittee";
import Dashboard from "./Dashboard";
import StudentDashboard from "./StudentDashboard";
import BalanceSheetDetails from "./BalanceSheetDetails";
import AddEvent from "./AddEvent";
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
import WorkExperienceReview from "./WorkExperienceReview";
import StudentPlacement from "./StudentPlacement";
import ExploreCompanies from "./ExploreCompanies";
import PlacementReviewForm from "./PlacementReviewForm";
import PlacementRequest from "./PlacementRequest";
import CompanyReviews from "./CompanyReviews";

const InstallPwaPrompt = ({ onInstall, onDismiss }) => (
  <div className="install-prompt-card">
    <div className="install-prompt-content">
      <h4>Install the ASCA App</h4>
      <p>Add this application to your home screen for quick and easy access.</p>
    </div>
    <div className="install-prompt-actions">
      <button className="install-btn--secondary" onClick={onDismiss}>
        Not now
      </button>
      <button className="install-btn--primary" onClick={onInstall}>
        Install
      </button>
    </div>
  </div>
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  // --- NEW: State for PWA installation ---
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstallPromptVisible, setIsInstallPromptVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);

      if (!sessionStorage.getItem("installPromptDismissed")) {
        setIsInstallPromptVisible(true);
      }
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        setIsInstallPromptVisible(false);
        setInstallPrompt(null);
      });
    }
  };

  const handleDismissInstall = () => {
    setIsInstallPromptVisible(false);

    sessionStorage.setItem("installPromptDismissed", "true");
  };

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
        return <Navigate to="/" />; // Navigate to the main login form
    }
  };

  return (
    <Router>
      {isInstallPromptVisible && (
        <InstallPwaPrompt
          onInstall={handleInstallClick}
          onDismiss={handleDismissInstall}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            !isLoggedIn ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/alumni-login"
          element={
            !isLoggedIn ? (
              <AlumniLogin onLogin={handleLogin} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route path="/alumni-register" element={<AlumniRegister />} />

        <Route
          path="/dashboard"
          element={isLoggedIn ? renderDashboard() : <Navigate to="/" />}
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
        <Route path="/alumnirequest" element={<AlumniRequests />} />
        <Route path="/community" element={<Community />} />
        <Route path="/work-experience" element={<WorkExperienceReview />} />
        <Route path="student-placement" element={<StudentPlacement />} />
          <Route path="explore" element={<ExploreCompanies />} />
          <Route path="review" element={<PlacementReviewForm />} />
          <Route path="request" element={<PlacementRequest />} />
          <Route path="/company/:slug/:type" element={<CompanyReviews />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;