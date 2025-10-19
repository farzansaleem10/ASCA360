import React from "react";
import "./Dashboard.css";
import {
  LayoutDashboard,
  Megaphone,
  CalendarDays,
  MessageSquareWarning,
  GraduationCap,
  HandCoins,
  Users,
  UserSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ModuleButton = ({ onClick, icon, children }) => (
  <button onClick={onClick} className="module-btn">
    {icon}
    <span>{children}</span>
  </button>
);

const StudentDashboard = ({ userName, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page-container">
      <header className="dashboard-header">
        <h2>WELCOME {userName}</h2>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </header>
      <main className="dashboard-grid">
        {/* Each module is now a self-contained button */}
        <ModuleButton
          onClick={() => navigate("/balance-sheet")}
          icon={<LayoutDashboard size={20} />}
        >
          Balance Sheet
        </ModuleButton>
        <ModuleButton
          onClick={() => navigate("/academics")}
          icon={<GraduationCap size={20} />}
        >
          Academics
        </ModuleButton>
        <ModuleButton
          onClick={() => navigate("/events")}
          icon={<CalendarDays size={20} />}
        >
          Events
        </ModuleButton>
        <ModuleButton
          onClick={() => navigate("/fundrequest")}
          icon={<HandCoins size={20} />}
        >
          Fund Request
        </ModuleButton>
        <ModuleButton
          onClick={() => navigate("/file-complaint")}
          icon={<MessageSquareWarning size={20} />}
        >
          File a Complaint
        </ModuleButton>
        <ModuleButton
          onClick={() => navigate("/view-announcement")}
          icon={<Megaphone size={20} />}
        >
          Announcements
        </ModuleButton>
        <ModuleButton
          onClick={() => navigate("/asca-committee")}
          icon={<UserSquare size={20} />}
        >
          ASCA Committee
        </ModuleButton>
        <ModuleButton
          onClick={() => navigate("/community")}
          icon={<Users size={20} />}
        >
          Community
        </ModuleButton>
          <ModuleButton
          onClick={() => navigate("/student-placement")}
          icon={<GraduationCap size={20} />}
        >
          Placement
        </ModuleButton>
      </main>
    </div>
  );
};

export default StudentDashboard;
