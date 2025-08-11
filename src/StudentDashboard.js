import React from "react";
import "./Dashboard.css";
import BalanceSheet from "./BalanceSheetDetails";
import { CalendarDays, MessageCircle, BookOpen, User2, FileText } from "lucide-react";
import { Banknote } from "lucide-react";
import { useNavigate } from 'react-router-dom';
const BalanceSheets = () => {
  const navigate = useNavigate();
  return (
    <div className="module-card">
      <button
        onClick={() => navigate('/balance-sheet')}
        className="module-btn"
      >
        <Banknote size={18} />
        View Balance Sheet
      </button>
    </div>
  );
};
const Messages = () => (
  <div className="module-card">
    <button className="module-btn" onClick={() => alert('Checking Messages...')}>
      <MessageCircle size={18} />
      Fund Request
    </button>
  </div>
);

const Courses = () => (
  <div className="module-card">
    <button className="module-btn" onClick={() => alert('Viewing Courses...')}>
      <BookOpen size={18} />
      Events
    </button>
  </div>
);

const Profile = () => (
  <div className="module-card">
    <button className="module-btn" onClick={() => alert('Viewing Profile...')}>
      <User2 size={18} />
      File a Complaint
    </button>
  </div>
);

const Results = () => (
  <div className="module-card">
    <button className="module-btn" onClick={() => alert('Viewing Results...')}>
      <FileText size={18} />
     Announcements
    </button>
  </div>
);

const StudentDashboard = ({userName}) => (
  <div className="dashboard-bg">
    <div className="dashboard-container">
      <header style={{ textAlign: "center", marginBottom: "24px" }}>
        <h2 style={{ color: "#fff", fontSize: "2rem", fontWeight: "bold", letterSpacing: "1px" }}>
          WELCOME {userName}
        </h2>
      </header>
      <main>
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
         <BalanceSheets /> {/* <-- Shows Google Sheet data */}
          <Messages />
          <Courses />
          <Profile />
          <Results />
        </div>
      </main>
    </div>
  </div>
);

export default StudentDashboard;