import React from 'react';
import './StudentPlacement.css'; // Import the new CSS file
import { Link } from 'react-router-dom';

const PlacementHub = () => {
  return (
    <div className="placement-hub-container">
      
      {/* --- HEADER --- */}
      <header className="hub-header">
        <h1 className="hub-title">
          <span>Your Guide to Campus
Placement Success</span>
        </h1>
        <p className="hub-subtitle">Real experiences from students who've been through the process. Get insights on interview rounds, assessments, and company culture.</p>
      </header>

      {/* --- 2-COLUMN GRID --- */}
      <div className="hub-grid">
        
        {/* --- CARD 1: Link to Explore page --- */}
        <Link to="/explore" className="hub-card-link">
          <div className="hub-card">
            <h3>Explore Companies</h3>
             <p className="hub-card-description">Share your own placement experience to help others prepare better.</p>
         
          </div>
        </Link>

        {/* --- CARD 2: Link to Review page --- */}
        <Link to="/review" className="hub-card-link">
          <div className="hub-card">
            <h3>Write placement Review</h3>
            <p className="hub-card-description">Share your own placement experience to help others prepare better.</p>
          </div>
        </Link>

      </div>
    </div>
  );
};

export default PlacementHub;