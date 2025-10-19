import React, { useState, useEffect, useRef } from "react";
import backendUrl from "./config";
import "./WorkExperienceReview.css";

const companyList = [
  "Accenture",
  "Soti",
  "Electrifex",
  "Federal Bank",
  "Mitsogo",
  "J&J Sourcing",
  "LTI Mindtree",
  "Nalasha",
  "Quantiphi",
  "TCS",
];

const WorkExperienceReview = ({ alumniData }) => {
  // --- 1. ALL STATE HOOKS MUST BE DECLARED FIRST ---
  // Basic Info
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [batch, setBatch] = useState("");
  const [timeline, setTimeline] = useState("");
  const [ctcStipend, setCtcStipend] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Experience Details
  const [workLifeBalance, setWorkLifeBalance] = useState(3); // Default to middle
  const [cultureRating, setCultureRating] = useState(3); // Default to middle
  const [learningOpportunities, setLearningOpportunities] = useState("");
  const [growthProspects, setGrowthProspects] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [overallExperience, setOverallExperience] = useState("");
  
  // UI State
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // --- 2. REFS DECLARED AFTER STATE ---
  const workLifeSliderRef = useRef(null);
  const cultureSliderRef = useRef(null);

  // --- 3. EFFECTS DECLARED AFTER REFS ---
  // Effect to update the work-life slider's fill
  useEffect(() => {
    if (workLifeSliderRef.current) {
      const min = 1;
      const max = 5;
      const value = workLifeBalance;
      const percent = ((value - min) / (max - min)) * 100;
      workLifeSliderRef.current.style.setProperty('--value-percent', `${percent}%`);
    }
  }, [workLifeBalance]); // Dependency array is crucial

  // Effect to update the culture slider's fill
  useEffect(() => {
    if (cultureSliderRef.current) {
      const min = 1;
      const max = 5;
      const value = cultureRating;
      const percent = ((value - min) / (max - min)) * 100;
      cultureSliderRef.current.style.setProperty('--value-percent', `${percent}%`);
    }
  }, [cultureRating]); // Dependency array is crucial


  // --- 4. FUNCTIONS DECLARED LAST ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName || !jobTitle || !batch) {
      setMessage("Please fill in all required fields (*).");
      return;
    }
    setLoading(true);
    setMessage("");

    const payload = {
      companyName, jobTitle, department, batch, timeline, ctcStipend,
      isAnonymous, workLifeBalance, cultureRating, learningOpportunities,
      growthProspects, pros, cons, overallExperience,
      createdBy: `${alumniData.firstName} ${alumniData.lastName}`,
      alumniId: alumniData._id,
    };

    try {
      const response = await fetch(`${backendUrl}/work-reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        // Reset form to defaults
        setCompanyName(""); setJobTitle(""); setDepartment(""); setBatch("");
        setTimeline(""); setCtcStipend(""); setIsAnonymous(false);
        setWorkLifeBalance(3); setCultureRating(3); setLearningOpportunities("");
        setGrowthProspects(""); setPros(""); setCons(""); setOverallExperience("");
      } else {
        setMessage(data.message || "Failed to submit review.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      setMessage("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // The return statement is the very last part of the component
  return (
    <div className="work-review-container">
      <h3 className="work-review-title">Submit a Work Experience Review</h3>
      <p className="work-review-subtitle">
        Share your insights about a company you've worked for.
      </p>

      <form onSubmit={handleSubmit} className="announcement-form">
        <div className="review-card">
          <h4 className="review-card-title">Basic Information</h4>
          
          <label htmlFor="companyName">Company *</label>
          <select id="companyName" className="announcement-select" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required>
            <option value="" disabled>Select a company</option>
            {companyList.map((company) => (<option key={company} value={company}>{company}</option>))}
          </select>
          <label htmlFor="jobTitle">Job Title *</label>
          <input id="jobTitle" className="announcement-input" type="text" placeholder="e.g., Software Engineer Intern" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required />
          <label htmlFor="department">Department</label>
          <input id="department" className="announcement-input" type="text" placeholder="e.g., Engineering, Product" value={department} onChange={(e) => setDepartment(e.target.value)} />
          <label htmlFor="batch">Batch *</label>
          <input id="batch" className="announcement-input" type="text" placeholder="e.g., 2024" value={batch} onChange={(e) => setBatch(e.target.value)} required />
          <label htmlFor="timeline">Duration</label>
          <input id="timeline" className="announcement-input" type="text" placeholder="e.g., May - July 2023 (3 months)" value={timeline} onChange={(e) => setTimeline(e.target.value)} />
          <label htmlFor="ctcStipend">CTC / Stipend</label>
          <input id="ctcStipend" className="announcement-input" type="text" placeholder="e.g., 50k/month" value={ctcStipend} onChange={(e) => setCtcStipend(e.target.value)} />
          <div className="anonymous-checkbox-container">
            <input type="checkbox" id="anonymous" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
            <label htmlFor="anonymous">Post anonymously</label>
          </div>
        </div>

        <div className="review-card">
          <h4 className="review-card-title">Experience Details</h4>

          <label htmlFor="workLife">Work-Life Balance: {workLifeBalance}/5</label>
          <input
            ref={workLifeSliderRef}
            id="workLife"
            type="range"
            min="1"
            max="5"
            value={workLifeBalance}
            onChange={(e) => setWorkLifeBalance(parseInt(e.target.value))}
            className="range-slider"
          />

          <label htmlFor="culture">Company Culture: {cultureRating}/5</label>
          <input
            ref={cultureSliderRef}
            id="culture"
            type="range"
            min="1"
            max="5"
            value={cultureRating}
            onChange={(e) => setCultureRating(parseInt(e.target.value))}
            className="range-slider"
          />
          
           <label htmlFor="learning">Learning Opportunities</label>
          <textarea id="learning" className="announcement-textarea" placeholder="Describe the learning and skill development opportunities" value={learningOpportunities} onChange={(e) => setLearningOpportunities(e.target.value)} rows={3} />
          <label htmlFor="growth">Growth Prospects</label>
          <textarea id="growth" className="announcement-textarea" placeholder="Describe career growth and advancement opportunities" value={growthProspects} onChange={(e) => setGrowthProspects(e.target.value)} rows={3} />
          <label htmlFor="pros">Pros</label>
          <textarea id="pros" className="announcement-textarea" placeholder="What did you like about working here?" value={pros} onChange={(e) => setPros(e.target.value)} rows={3} />
          <label htmlFor="cons">Cons</label>
          <textarea id="cons" className="announcement-textarea" placeholder="What could be improved?" value={cons} onChange={(e) => setCons(e.target.value)} rows={3} />
          <label htmlFor="overall">Overall Experience</label>
          <textarea id="overall" className="announcement-textarea" placeholder="Summarize your overall experience" value={overallExperience} onChange={(e) => setOverallExperience(e.target.value)} rows={4} />
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
      
      {message && (
        <p className={`announcement-message ${message.includes("Failed") || message.includes("error") ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default WorkExperienceReview;

