import React from "react";
import {
  BookCopy,
  Layers3,
  Code,
  GraduationCap,
  ArrowUpRight,
} from "lucide-react";
import "./Academics.css";
const academicSections = [
  {
    title: "MCA Syllabus",
    description: "View the official curriculum for all semesters.",
    icon: <BookCopy size={32} className="card-icon" />,
    url: "/McaSyllabus.pdf",
  },
  {
    title: "MCA Study Materials",
    description: "Access notes, presentations, and resources.",
    icon: <Layers3 size={32} className="card-icon" />,
    url: "https://techworldthink.github.io/MCA/",
  },
  {
    title: "MCA-Laboratory",
    description: "Find lab manuals, code samples, and exercises.",
    icon: <Code size={32} className="card-icon" />,
    url: "https://github.com/cetmca26/MCA-Laboratory",
  },

];

const Academics = () => {
  const handleSectionClick = (url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="academics-container">
      <header className="academics-header">
        <h1>Academics</h1>
        <p>Explore resources for your master's program.</p>
      </header>

      <main className="academics-grid">
        {academicSections.map((section, index) => (
          <div
            key={index}
            className="academic-card"
            onClick={() => handleSectionClick(section.url)}
          >
            <div className="card-content">
              {section.icon}
              <h2 className="card-title">{section.title}</h2>
              <p className="card-description">{section.description}</p>
            </div>
            <ArrowUpRight className="card-arrow-icon" size={24} />
          </div>
        ))}
      </main>
    </div>
  );
};

export default Academics;
