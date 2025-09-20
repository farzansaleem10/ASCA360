import React from 'react';
import { ArrowLeft, CheckCircle, PlayCircle } from 'lucide-react';
import './PlacementCourse.css'; // We will create this CSS file next

// Dummy data to replicate the course content sidebar
const courseVideos = [
  { id: 1, title: 'Percentage Part 5 - Advanced Shortcuts', completed: true },
  { id: 2, title: 'Percentage Part 6 - Complete All Shortcuts', completed: true, current: true },
  { id: 3, title: 'Percentage Practice Marathon (PSI)', completed: false },
  { id: 4, title: 'Percentage Full Practice Set - Marathon', completed: false },
  { id: 5, title: 'Profit and Loss Basics', completed: false },
  { id: 6, title: 'Advanced Profit and Loss', completed: false },
];

const PlacementCourse = ({ onBack }) => {
  // IMPORTANT: Replace 'VIDEO_ID_HERE' with the ID of a YouTube video that allows embedding.
  // The "Video unavailable" error in your screenshot is because the video's owner has disabled playback on external sites.
  // This is a YouTube setting, not a code error. I've used a placeholder ID.
  const videoId = 'gfkTfcpWqAY'; 

  return (
    <div className="placement-course-container">
      <header className="placement-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={24} /> Back to Academics
        </button>
      </header>
      <div className="course-layout">
        <main className="video-player-section">
          <h2>Percentage Part 6 - Complete All Shortcuts</h2>
          <div className="video-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="video-description">
            This video covers all the important shortcuts and techniques for solving percentage-based problems quickly. Essential for all competitive exams.
          </p>
        </main>
        <aside className="course-content-sidebar">
          <h3>Course Content</h3>
          <p className="progress-text">10 of 12 videos completed</p>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${(10 / 12) * 100}%` }}></div>
          </div>
          <ul className="video-list">
            {courseVideos.map(video => (
              <li key={video.id} className={`video-list-item ${video.current ? 'current' : ''}`}>
                {video.completed ? <CheckCircle size={20} className="icon completed-icon" /> : <PlayCircle size={20} className="icon" />}
                <span className="video-title">{video.title}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default PlacementCourse;