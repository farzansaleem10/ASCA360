import React, { useState } from "react";
import "./comit.css";

const committeeImages = {
  2025: "committe.jpg",
  2024: "commit24-25.png",
  2023: "commit23-24.png",
  2022: "commit22-23.png",
  2021: "commit21-22.png",
};

const AscaCommittee = () => {
  const [selectedYear, setSelectedYear] = useState("2025");

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <div className="committee-container">
      <header className="committee-header">
        <h1>ASCA Committee</h1>
        <p>View the committee members for the selected academic year.</p>
      </header>

      <div className="committee-content">
        <div className="year-selector">
          <label htmlFor="committee-year">Select Year</label>
          <select
            id="committee-year"
            value={selectedYear}
            onChange={handleYearChange}
            className="year-dropdown"
          >
            {Object.keys(committeeImages).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="image-wrapper">
          <img
            src={committeeImages[selectedYear]}
            alt={`ASCA Committee ${selectedYear}`}
            className="committee-image"
          />
        </div>
      </div>
    </div>
  );
};

export default AscaCommittee;
