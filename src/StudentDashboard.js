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
const ViewAnnouncements = () => {
  const navigate = useNavigate();
  return (
    <div className="module-card">
      <button
        onClick={() => navigate('/view-announcement')}
        className="module-btn"
      >
        <Banknote size={18} />
        Announcements
      </button>
    </div>
  );
};
const Events = () => {
  const navigate = useNavigate();
  return (
    <div className="module-card">
      <button 
        className="module-btn" 
        // When clicked, this button navigates to the '/events' page.
        onClick={() => navigate('/events')}
      >
        <BookOpen size={18} />
        Events
      </button>
    </div>
  );};

const FileComplaint = () => {
  const navigate = useNavigate();
  return (
    <div className="module-card">
      <button 
        className="module-btn" 
        // When clicked, this button navigates to the '/events' page.
        onClick={() => navigate('/file-complaint')}
      >
        <BookOpen size={18} />
        File a Complaint
      </button>
    </div>
  );};


const Academics = () => {
  const navigate = useNavigate();
  return (
    <div className="module-card">
      <button 
        className="module-btn" 
        // When clicked, this button navigates to the '/events' page.
        onClick={() => navigate('/academics')}
      >
        <BookOpen size={18} />
       Academics
      </button>
    </div>
  );};
const  FundRequest= () => {
  const navigate = useNavigate();
  return (
    <div className="module-card">
      <button 
        className="module-btn" 
        // When clicked, this button navigates to the '/events' page.
        onClick={() => navigate('/fundrequest')}
      >
        <BookOpen size={18} />
       Fund Request
      </button>
    </div>
  );};
  const  Community= () => {
  const navigate = useNavigate();
  return (
    <div className="module-card">
      <button 
        className="module-btn" 
        // When clicked, this button navigates to the '/events' page.
        onClick={() => navigate('/community')}
      >
        <BookOpen size={18} />
       Community
      </button>
    </div>
  );};
  const Committee = () => {
  const navigate = useNavigate();
  return (
    <div className="module-card">
      <button 
        className="module-btn" 
        // When clicked, this button navigates to the '/events' page.
        onClick={() => navigate('/asca-committee')}
      >
        <BookOpen size={18} />
        ASCA Commitee
      </button>
    </div>
  );};
  



const StudentDashboard = ({userName,onLogout}) => (
  <div className="dashboard-bg">
 <button className="logout-btn" onClick={onLogout}>Logout</button>
    <div className="dashboard-container">
      <header style={{ textAlign: "center", marginBottom: "24px" }}>
        <h2 style={{ color: "#fff", fontSize: "2rem", fontWeight: "bold", letterSpacing: "1px" }}>
          WELCOME {userName}
        </h2>
      </header>
      <main>
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
         <BalanceSheets /> {/* <-- Shows Google Sheet data */}
          <Academics/>
          <Events />
          <FundRequest/>
          <FileComplaint />
          <ViewAnnouncements />
          <Committee/>
          <Community/>
        </div>
      </main>
    </div>
  </div>
);

export default StudentDashboard;