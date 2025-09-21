import React, { useEffect, useState } from "react";
import "./BalanceSheet.css";
import { Banknote, ExternalLink, RefreshCw } from "lucide-react";
import axios from "axios";

const BalanceSheetDetails = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // A function to fetch the data from the API
  const fetchData = () => {
    setLoading(true);
    setError(null);
    console.log('Fetching balance sheet data...');
    fetch("https://asca360.onrender.com/finances/balance-sheet")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Received data:', data);
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

  // The useEffect hook now depends on `refreshTrigger`
  // It will run on initial component load and whenever the refresh button is clicked
  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  // Handler for the refresh button
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1); // Incrementing state triggers the useEffect
  };

  const renderCell = (cell, columnIndex) => {
    // Check if it's a proof link (column 5)
    if (columnIndex === 5 && cell && cell.includes('drive.google.com')) {
      return (
        <a 
          href={cell} 
          target="_blank" 
          rel="noopener noreferrer"
          className="proof-link"
        >
          <ExternalLink size={16} />
          View Proof
        </a>
      );
    }
    
    // Check if it's a credit/debit amount (columns 3 and 4)
    if (((columnIndex === 3)|| columnIndex === 4) && cell && cell !== '') {
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

  if (loading) return <div className="module-card">Loading...</div>;
  if (error) return <div className="module-card error-message">Error: {error}</div>;

  return (
    <div className="module-card">
      <div className="balance-sheet-header">
        <div className="title-container">
          <Banknote size={20} />
          <span className="balance-sheet-title">ASCA 2025-2026</span>
        </div>
        <button onClick={handleRefresh} className="refresh-button" disabled={loading}>
          <RefreshCw size={16} className={loading ? "spinner" : ""} />
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="no-data-message">No data available.</div>
      ) : (
        <div className="balance-sheet-container">
          <table className="balance-table">
            <thead>
              <tr>
                {rows[0] && rows[0].map((header, index) => (
                  <th key={index} className="table-header">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'even-row' : 'odd-row'}>
                  {row.map((cell, j) => (
                    <td key={j} className="table-cell">
                      {renderCell(cell, j)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BalanceSheetDetails;