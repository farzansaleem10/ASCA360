import React from 'react';
import './Semester1.css';
import { Book, Code, Sigma, Network, Cpu, NotebookText } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

const Semester1 = () => {
  const navigate = useNavigate();

  const handleSubjectClick = (subjectName) => {
    alert(`Showing details for ${subjectName}...`);
  
  };

  return (
    <div className="semester-container">
      <header className="semester-header">
        <button onClick={() => navigate(-1)} className="back-button">← Back to Academics</button>
        <h1>Semester 1</h1>
        <p>Choose a subject to view resources.</p>
      </header>

      <main className="subjects-grid">

        <div className="subject-card" onClick={() => handleSubjectClick('Syllabus')}>
          <NotebookText size={48} className="subject-icon" />
          <h2>Syllabus</h2>
        </div>

        <div className="subject-card" onClick={() => handleSubjectClick('Data Structure')}>
          <Cpu size={48} className="subject-icon" />
          <h2>Data Structure</h2>
        </div>
     
        <div className="subject-card" onClick={() => handleSubjectClick('Software Engineering')}>
          <Code size={48} className="subject-icon" />
          <h2>Software Engineering</h2>
        </div>

        <div className="subject-card" onClick={() => handleSubjectClick('Mathematics')}>
          <Sigma size={48} className="subject-icon" />
          <h2>Mathematics</h2>
        </div>

        <div className="subject-card" onClick={() => handleSubjectClick('Digital Fundamentals')}>
          <Network size={48} className="subject-icon" />
          <h2>Digital Fundamentals</h2>
        </div>
  
        <div className="subject-card" onClick={() => handleSubjectClick('Computer Networks')}>
          <Book size={48} className="subject-icon" />
          <h2>Computer Networks</h2>
        </div>
      </main>
    </div>
  );
};

export default Semester1;
