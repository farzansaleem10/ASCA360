import React from "react";
import "./Dashboard.css";
import { Banknote, Wallet, CalendarDays, MessageSquareWarning, Megaphone } from "lucide-react";
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
const RecordTransaction = () => (
  <div className="module-card">
    <button
      onClick={() => alert('Add a Transaction...')}
      className="module-btn"
    >
      <Banknote size={18} />
      Record a Transaction
    </button>
  </div>
);



const FundRequest = () => (
  <div className="module-card">
    <button
      onClick={() => alert('Submitting Fund Request...')}
      className="module-btn"
    >
      <Wallet size={18} />
       Fund Requests
    </button>
  </div>
);

const Events = () => {
  const navigate = useNavigate();
  return (
    <div className="module-card">
      <button
        // When clicked, this button will now navigate to the '/events-admin' page.
        onClick={() => navigate('/events-admin')}
        className="module-btn"
      >
        <CalendarDays size={18} />
        Events
      </button>
    </div>
  );
};
const ComplaintRecieved = () => {
  const navigate = useNavigate();
  return (
    <div className="module-card">
      <button
        // When clicked, this button will now navigate to the '/events-admin' page.
        onClick={() => navigate('/view-complaint')}
        className="module-btn"
      >
        <CalendarDays size={18} />
        View Complaints
      </button>
    </div>
  );
};
const CreateAnnouncement = () => {
  const navigate = useNavigate();
  return (
    <div className="module-card">
      <button
        // When clicked, this button will now navigate to the '/events-admin' page.
        onClick={() => navigate('/add-announcement')}
        className="module-btn"
      >
        <CalendarDays size={18} />
        Add Announcement
      </button>
    </div>
  );
};
const DashBoard = ({ userRole = "asca", onLogout = () => {} }) => {
  const navigate = useNavigate();
  
  return (
    <div className="dashboard-bg">
      <div className="dashboard-container" style={{ position: "relative" }}>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
        <header style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2 style={{ color: "#fff", fontSize: "2rem", fontWeight: "bold", letterSpacing: "1px" }}>
            Welcome Asca Admin
          </h2>
        </header>
        <main>
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <BalanceSheets />
            <RecordTransaction />
            <FundRequest />
            <Events />
            <ComplaintRecieved />
            <CreateAnnouncement />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashBoard;