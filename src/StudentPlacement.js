import React from 'react';
import './Placement.css';
import { Search, Edit } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const StudentPlacement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the studentData that was passed from the dashboard
  const studentData = location.state?.studentData; 

  // This function navigates to the new page and passes the studentData along
  const handleNavigate = (path) => {
    navigate(path, { state: { studentData } });
  };

  return (
    <div className="placement-container">
      <header className="placement-header">
        <h1>Placement Portal</h1>
        <p>Explore companies and share your placement experiences.</p>
      </header>
      
      <div className="placement-tabs">
        {/* Button to navigate to the Explore Companies page */}
        <button 
          className="placement-tab"
          onClick={() => handleNavigate('/explore')}
        >
          <Search size={18} /> Explore Companies
        </button>

        {/* Button to navigate to the Write Review page */}
        <button 
          className="placement-tab"
          onClick={() => handleNavigate('/review')}
        >
          <Edit size={18} /> Write a Review
        </button>
      </div>
      
      {/* The main content is removed, as this is now a navigation hub */}
    </div>
  );
};

export default StudentPlacement;

