import React, { useState } from 'react';
import './comit.css';

// --- IMPORTANT ---
// Create an object to map each year to its corresponding image file.
// You must have these image files in your /public folder.
const committeeImages = {
  '2025': 'committe.jpg', // Default or current year's image
  '2024': 'commit24-25.png',
  '2023': 'commit23-24.png',
  '2022': 'commit22-23.png',
  '2021': 'commit21-22.png',
};

const AscaCommittee = () => {
  // State to keep track of the currently selected year.
  // The initial value is set to '2025'.
  const [selectedYear, setSelectedYear] = useState('2025');

  // This function is called whenever the user selects a new year from the dropdown.
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <div className="committee-wrapper">
      <h2 className="committee-title">ASCA Committee</h2>

      {/* The new dropdown for year selection */}
      <div className="year-selector">
        <label htmlFor="committee-year">Select Year:</label>
        <select
          id="committee-year"
          value={selectedYear}
          onChange={handleYearChange}
          className="year-dropdown"
        >
          {/* Dynamically create the dropdown options from the committeeImages object */}
          {Object.keys(committeeImages).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <img
        // The image source is now dynamic and changes based on the selected year.
        src={committeeImages[selectedYear]}
        alt={`ASCA Committee ${selectedYear}`}
        className="committee-image"
      />
    </div>
  );
};

export default AscaCommittee;
