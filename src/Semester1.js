import React from 'react';
import './Semester1.css'; // Importing the stylesheet for this component
import { Book, Code, Sigma, Network, Cpu, NotebookText } from 'lucide-react'; // Relevant icons
import { useNavigate } from 'react-router-dom';

// This component displays the subjects for Semester 1.
const Semester1 = () => {
  const navigate = useNavigate();

  // This would navigate to a specific subject's detail page in a full app.
  const handleSubjectClick = (subjectName) => {
    alert(`Showing details for ${subjectName}...`);
    // Example future navigation: navigate(`/academics/semester-1/${subjectName.toLowerCase().replace(/ /g, '-')}`);
  };

  return (
    <div className="semester-container">
      <header className="semester-header">
        <button onClick={() => navigate(-1)} className="back-button">← Back to Academics</button>
        <h1>Semester 1</h1>
        <p>Choose a subject to view resources.</p>
      </header>

      <main className="subjects-grid">
        {/* Card for Syllabus */}
        <div className="subject-card" onClick={() => handleSubjectClick('Syllabus')}>
          <NotebookText size={48} className="subject-icon" />
          <h2>Syllabus</h2>
        </div>

        {/* Card for Data Structure */}
        <div className="subject-card" onClick={() => handleSubjectClick('Data Structure')}>
          <Cpu size={48} className="subject-icon" />
          <h2>Data Structure</h2>
        </div>
        
        {/* Card for Software Engineering */}
        <div className="subject-card" onClick={() => handleSubjectClick('Software Engineering')}>
          <Code size={48} className="subject-icon" />
          <h2>Software Engineering</h2>
        </div>

        {/* Card for Mathematics */}
        <div className="subject-card" onClick={() => handleSubjectClick('Mathematics')}>
          <Sigma size={48} className="subject-icon" />
          <h2>Mathematics</h2>
        </div>

        {/* Card for Digital Fundamentals */}
        <div className="subject-card" onClick={() => handleSubjectClick('Digital Fundamentals')}>
          <Network size={48} className="subject-icon" />
          <h2>Digital Fundamentals</h2>
        </div>
        
        {/* Card for Computer Networks */}
        <div className="subject-card" onClick={() => handleSubjectClick('Computer Networks')}>
          <Book size={48} className="subject-icon" />
          <h2>Computer Networks</h2>
        </div>
      </main>
    </div>
  );
};

export default Semester1;
