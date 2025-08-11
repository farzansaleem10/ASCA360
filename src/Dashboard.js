import React from "react";
import "./Dashboard.css";
import BalanceSheet from "./BalanceSheetDetails";
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

const Events = () => (
  <div className="module-card">
    <button
      onClick={() => alert('Viewing Events...')}
      className="module-btn"
    >
      <CalendarDays size={18} />
       Events
    </button>
  </div>
);

const ComplaintRecieved = () => (
  <div className="module-card">
    <button
      onClick={() => alert('Filing a Complaint...')}
      className="module-btn"
    >
      <MessageSquareWarning size={18} />
      Complaints received
    </button>
  </div>
);

const Announcements = () => (
  <div className="module-card">
    <button
      onClick={() => alert('Reading Announcements...')}
      className="module-btn"
    >
      <Megaphone size={18} />
      Announcements
    </button>
  </div>
);

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
            <Announcements />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashBoard;