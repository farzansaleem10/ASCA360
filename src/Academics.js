import React from 'react';
import { BookMarked, FileText, BotMessageSquare, History, ArrowRight } from 'lucide-react';
import './Academics.css'; // Make sure this CSS file is in the same directory

// --- UPDATE: 'path' has been changed to 'url' to hold the full GitHub links ---
const academicSections = [
  {
    title: 'MCA Syllabus',
    description: 'View the official curriculum.',
    icon: <FileText size={48} className="card-icon" />,
    // Replace with your actual GitHub link
    url: 'https://github.com/your-username/your-repo/tree/main/syllabus'
  },
  {
    title: 'MCA Study Materials',
    description: 'Access notes and resources.',
    icon: <BotMessageSquare size={48} className="card-icon" />,
    // Replace with your actual GitHub link
    url: 'https://github.com/cetmca26/Study-Materials'
  },
  {
    title: 'MCA-Laboratory',
    description: 'Find lab manuals and exercises.',
    icon: <BotMessageSquare size={48} className="card-icon" />,
    // Replace with your actual GitHub link
    url: 'https://github.com/cetmca26/MCA-Laboratory'
  },
  {
    title: 'Placement Course',
    description: 'Prepare for job interviews.',
    icon: <History size={48} className="card-icon" />,
    // Replace with your actual GitHub link
    url: 'https://github.com/your-username/your-repo/tree/main/placement-course'
  }
];

// --- UPDATE: The 'onNavigate' prop is no longer needed ---
const Academics = () => {

  // --- UPDATE: This function now opens the URL in a new tab ---
  const handleSectionClick = (url) => {
    if (url) {
      // This command opens the provided link in a new browser tab
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // The main component now just renders the grid
  return (
    <div className="academics-container">
      <header className="academics-header">
        <h1 className="header-title">
          <BookMarked size={32} className="header-icon" />
          Academics
        </h1>
        <p className="header-subtitle">Explore resources for your master's program.</p>
      </header>

      <main className="academics-grid">
        {academicSections.map((section, index) => (
          <div 
            key={index} 
            className="academic-card"
            // --- UPDATE: The click handler now passes the URL ---
            onClick={() => handleSectionClick(section.url)}
          >
            <div className="card-content">
              {section.icon}
              <h2 className="card-title">{section.title}</h2>
              <p className="card-description">{section.description}</p>
            </div>
            <button 
              className="card-button"
              onClick={(e) => {
                e.stopPropagation(); 
                handleSectionClick(section.url);
              }} 
            >
              View Resources <ArrowRight size={20} className="button-icon" />
            </button>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Academics;
