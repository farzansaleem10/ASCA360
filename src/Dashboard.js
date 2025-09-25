import React from "react";
import "./Dashboard.css"; // Using the same theme stylesheet
import { 
    LayoutDashboard, 
    PenSquare, 
    HandCoins, 
    CalendarDays, 
    MessageSquareWarning, 
    UserCheck, 
    Megaphone 
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

// A reusable button component for the dashboard modules
const ModuleButton = ({ onClick, icon, children }) => (
    <button onClick={onClick} className="module-btn">
        {icon}
        <span>{children}</span>
    </button>
);

const DashBoard = ({ onLogout }) => {
    const navigate = useNavigate();

    // --- All navigation logic is preserved below ---
    return (
        <div className="dashboard-page-container">
            <header className="dashboard-header">
                <h2>Welcome Asca Admin</h2>
                <button className="logout-btn" onClick={onLogout}>Logout</button>
            </header>
            <main className="dashboard-grid">
                <ModuleButton onClick={() => navigate('/balance-sheet')} icon={<LayoutDashboard size={20} />}>
                    Balance Sheet
                </ModuleButton>
                <ModuleButton onClick={() => alert('Add a Transaction...')} icon={<PenSquare size={20} />}>
                    Record a Transaction
                </ModuleButton>
                <ModuleButton onClick={() => navigate('/fundpending')} icon={<HandCoins size={20} />}>
                    Fund Requests
                </ModuleButton>
                <ModuleButton onClick={() => navigate('/events-admin')} icon={<CalendarDays size={20} />}>
                    Events
                </ModuleButton>
                <ModuleButton onClick={() => navigate('/view-complaint')} icon={<MessageSquareWarning size={20} />}>
                    View Complaints
                </ModuleButton>
                <ModuleButton onClick={() => navigate('/alumnirequest')} icon={<UserCheck size={20} />}>
                    Alumni Requests
                </ModuleButton>
                <ModuleButton onClick={() => navigate('/add-announcement')} icon={<Megaphone size={20} />}>
                    Add Announcement
                </ModuleButton>
            </main>
        </div>
    );
};

export default DashBoard;
