// AscaCommittee.js
import React from 'react';
import './comit.css';

const AscaCommittee = () => {
  return (
    <div className="committee-wrapper">
      <h2 className="committee-title">ASCA Committee</h2>
      <img
        src="committe.jpg" // Update path if needed
        alt="ASCA Committee"
        className="committee-image"
      />
    </div>
  );
};

export default AscaCommittee;
