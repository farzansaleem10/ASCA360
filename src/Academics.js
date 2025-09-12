import React from 'react';
import { BookMarked, FileText, BotMessageSquare, History, ArrowRight } from 'lucide-react';
import './Academics.css'; // Make sure this CSS file is in the same directory

// Data for each academic section, including the new GitHub link
const academicSections = [
  {
    title: 'MCA Syllabus',
    description: 'View the official curriculum.',
    icon: <FileText size={48} className="card-icon" />,
    link: 'https://github.com/your-username/mca-syllabus-repo' // <-- REPLACE WITH YOUR GITHUB LINK
  },
  {
    title: 'MCA Study Materials',
    description: 'Access notes and resources.',
    icon: <BotMessageSquare size={48} className="card-icon" />,
    link: 'https://github.com/cetmca26/Study-Materials' // <-- REPLACE WITH YOUR GITHUB LINK
  },
  {
    title: 'MCA-Laboratory',
    description: 'Find lab manuals and exercises.',
    icon: <BotMessageSquare size={48} className="card-icon" />,
    link: 'https://github.com/cetmca26/MCA-Laboratory' // <-- REPLACE WITH YOUR GITHUB LINK
  },
  {
    title: 'Placement Course',
    description: 'Prepare for job interviews.',
    icon: <History size={48} className="card-icon" />,
    link: 'https://github.com/your-username/placement-course-repo' // <-- REPLACE WITH YOUR GITHUB LINK
  }
];


const Academics = () => {

  // This function now takes a URL and opens it in a new browser tab
  const handleSectionClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

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
        {/* We now map over the array to create the cards dynamically */}
        {academicSections.map((section, index) => (
          <div 
            key={index} 
            className="section-card"
            // The whole card is now clickable
            onClick={() => handleSectionClick(section.link)}
          >
            <div className="card-content">
              {section.icon}
              <h2 className="card-title">{section.title}</h2>
              <p className="card-description">{section.description}</p>
            </div>
            <button 
              className="card-button"
              // This onClick handler now also uses the link from our data
              onClick={(e) => {
                // Prevent the card's click event from firing as well
                e.stopPropagation(); 
                handleSectionClick(section.link);
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

