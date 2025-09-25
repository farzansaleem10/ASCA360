import React, { useEffect, useState } from "react";
import "./BalanceSheet.css"; // Using the new stylesheet
import { Banknote, ExternalLink, RefreshCw } from "lucide-react";
import backendUrl from "./config";

const BalanceSheetDetails = () => {
    // All existing state and logic is preserved
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const fetchData = () => {
        setLoading(true);
        setError(null);
        fetch(`${backendUrl}/finances/balance-sheet`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setRows(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setError(error.message);
                setRows([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [refreshTrigger]);

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };
    
    // This function remains the same, but the CSS classes it applies are restyled
    const renderCell = (cell, columnIndex) => {
        if (columnIndex === 5 && cell && cell.includes('drive.google.com')) {
            return (
                <a href={cell} target="_blank" rel="noopener noreferrer" className="proof-link">
                    <ExternalLink size={16} />
                    View Proof
                </a>
            );
        }
        if (((columnIndex === 3) || columnIndex === 4) && cell && cell !== '') {
            const amount = parseFloat(cell);
            const isCredit = columnIndex === 3;
            return (
                <span className={`amount ${isCredit ? 'credit' : 'debit'}`}>
                    ₹{amount.toLocaleString()}
                </span>
            );
        }
        return cell;
    };

    // The JSX is updated with new classNames for the fintech theme
    return (
        <div className="balance-sheet-page-container">
            <div className="balance-sheet-wrapper">
                <header className="balance-sheet-header">
                    <div className="header-title">
                        <Banknote size={24} />
                        <h1>ASCA Balance Sheet (2025-2026)</h1>
                    </div>
                    <button onClick={handleRefresh} className="refresh-btn" disabled={loading}>
                        <RefreshCw size={16} className={loading ? "spinner" : ""} />
                        <span>Refresh</span>
                    </button>
                </header>

                <div className="balance-sheet-content">
                    {loading ? (
                        <div className="status-message">Loading...</div>
                    ) : error ? (
                        <div className="status-message error">Error: {error}</div>
                    ) : rows.length === 0 ? (
                        <div className="status-message">No data available.</div>
                    ) : (
                        <div className="table-container">
                            <table className="balance-sheet-table">
                                <thead>
                                    <tr>
                                        {rows[0] && rows[0].map((header, index) => (
                                            <th key={index}>{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.slice(1).map((row, i) => (
                                        <tr key={i}>
                                            {row.map((cell, j) => (
                                                <td key={j}>{renderCell(cell, j)}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BalanceSheetDetails;
