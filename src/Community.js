import React, { useState, useEffect } from 'react';
import './Community.css'; // Using the new stylesheet
import backendUrl from './config'; // Assuming config file is present for backend URL

// The modal component is restyled but functionally the same
const AlumniProfileModal = ({ alumni, onClose }) => {
    if (!alumni) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <div className="modal-header">
                    <img
                        src={alumni.photoUrl}
                        alt={`${alumni.firstName} ${alumni.lastName}`}
                        className="modal-profile-pic"
                        onError={(e) => { e.target.src = 'https://placehold.co/150x150/1C1C1C/A1A1AA?text=No+Image'; }}
                    />
                </div>
                <div className="modal-body">
                    <h2>{alumni.firstName} {alumni.lastName}</h2>
                    <p className="modal-subtitle">MCA Graduate - {alumni.graduationYear}</p>

                    {alumni.currentWorkplace && alumni.currentWorkplace.institution && (
                        <div className="work-info">
                            <p>{alumni.currentWorkplace.designation} at <strong>{alumni.currentWorkplace.institution}</strong></p>
                        </div>
                    )}

                    <div className="contact-links">
                        {alumni.linkedin && <a href={alumni.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                        {alumni.github && <a href={alumni.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
                        {alumni.email && <a href={`mailto:${alumni.email}`}>Email</a>}
                    </div>

                    {alumni.experiences && alumni.experiences.length > 0 && (
                        <div className="details-section">
                            <h4>Past Experience</h4>
                            {alumni.experiences.map((exp, index) => {
                                if (exp.institution || exp.designation) {
                                    return (
                                        <p key={index}>
                                            {exp.designation} at <strong>{exp.institution}</strong> ({exp.years})
                                        </p>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


const Community = () => {
    // All existing state and logic is preserved
    const [allAlumni, setAllAlumni] = useState([]);
    const [filteredAlumni, setFilteredAlumni] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedAlumni, setSelectedAlumni] = useState(null);

    useEffect(() => {
        const fetchAlumni = async () => {
            try {
                setLoading(true);
                // Using the backendUrl for consistency
                const response = await fetch(`${backendUrl}/alumni/approved`);
                const data = await response.json();
                if (response.ok) {
                    setAllAlumni(data);
                    setFilteredAlumni(data);
                    const uniqueYears = [...new Set(data.map(a => a.graduationYear))].sort((a, b) => b - a);
                    setYears(uniqueYears);
                } else {
                    throw new Error(data.message || 'Failed to fetch alumni data.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAlumni();
    }, []);

    const handleYearChange = (e) => {
        const year = e.target.value;
        setSelectedYear(year);
        if (year) {
            setFilteredAlumni(allAlumni.filter(alumni => alumni.graduationYear.toString() === year));
        } else {
            setFilteredAlumni(allAlumni);
        }
    };
    
    // JSX is updated with new classNames for the fintech theme
    return (
        <div className="community-container">
            <AlumniProfileModal alumni={selectedAlumni} onClose={() => setSelectedAlumni(null)} />
            <header className="community-header">
                <h1>Alumni Community Network</h1>
                <div className="filter-wrapper">
                    <select value={selectedYear} onChange={handleYearChange} className="year-filter-select">
                        <option value="">Filter by Passout Year</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </header>

            <main className="community-content">
                {loading ? (
                    <p className="status-message">Loading community members...</p>
                ) : error ? (
                    <p className="status-message error">{error}</p>
                ) : (
                    <div className="alumni-grid">
                        {filteredAlumni.map(alumni => (
                            <div key={alumni._id} className="alumni-card" onClick={() => setSelectedAlumni(alumni)}>
                                <img
                                    src={alumni.photoUrl}
                                    alt={`${alumni.firstName} ${alumni.lastName}`}
                                    className="alumni-photo"
                                    onError={(e) => { e.target.src = 'https://placehold.co/150x150/1C1C1C/A1A1AA?text=No+Image'; }}
                                />
                                <div className="alumni-info">
                                    <h3>{alumni.firstName} {alumni.lastName}</h3>
                                    <p>MCA - {alumni.graduationYear}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Community;
