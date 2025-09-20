import React, { useState } from 'react';
import { BookMarked, FileText, BotMessageSquare, History, ArrowRight } from 'lucide-react';
import PlacementCourse from './PlacementCourse'; // Import the new component
import './Academics.css'; // Make sure this CSS file is in the same directory

// Data for each academic section
const academicSections = [
  {
    title: 'MCA Syllabus',
    description: 'View the official curriculum.',
    icon: <FileText size={48} className="card-icon" />,
    path: 'mca-syllabus'
  },
  {
    title: 'MCA Study Materials',
    description: 'Access notes and resources.',
    icon: <BotMessageSquare size={48} className="card-icon" />,
    path: 'mca-study-materials'
  },
  {
    title: 'MCA-Laboratory',
    description: 'Find lab manuals and exercises.',
    icon: <BotMessageSquare size={48} className="card-icon" />,
    path: 'mca-laboratory'
  },
  {
    title: 'Placement Course',
    description: 'Prepare for job interviews.',
    icon: <History size={48} className="card-icon" />,
    path: 'placement-course' // This path will now be handled internally
  }
];

const Academics = ({ onNavigate }) => {
  // State to control the view: 'main' grid or 'placement-course' video page
  const [currentView, setCurrentView] = useState('main');

  const handleSectionClick = (path, sectionTitle) => {
    // If the placement course is clicked, change the view internally
    if (path === 'placement-course') {
      setCurrentView('placement-course');
    } 
    // For other cards, use the original navigation logic
    else if (path) {
      onNavigate(path);
    } else {
      alert(`Navigating to ${sectionTitle}...`);
    }
  };

  // Conditionally render the PlacementCourse component
  if (currentView === 'placement-course') {
    return <PlacementCourse onBack={() => setCurrentView('main')} />;
  }

  // Render the default grid of academic cards
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
            onClick={() => handleSectionClick(section.path, section.title)}
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
                handleSectionClick(section.path, section.title);
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