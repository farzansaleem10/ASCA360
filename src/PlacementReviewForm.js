import React, { useState } from 'react';
import './review.css'; // Dedicated CSS for this component
import backendUrl from './config'; // Kept for submitting the form
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

// A static list of companies to be used in the dropdown, removing the backend dependency.
const staticCompanies = [
  { _id: '1', name: 'Accenture' },
  { _id: '2', name: 'Soti' },
  { _id: '3', name: 'Electrifex' },
  { _id: '4', name: 'Federal Bank' },
  { _id: '5', name: 'Mitsogo' },
  { _id: '6', name: 'J&J Sourcing' },
  { _id: '7', name: 'LTI Mindtree' },
  { _id: '8', name: 'Nalasha' },
  { _id: '9', name: 'Quantiphi' },
  { _id: '10', name: 'TCS' }
];

const PlacementReviewForm = ({ studentData }) => {
    // The 'companies' state and useEffect for fetching have been removed.
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // --- Form State ---
    const [companyId, setCompanyId] = useState("");
    const [positionAppliedFor, setPositionAppliedFor] = useState("");
    const [batch, setBatch] = useState("");
    const [timeline, setTimeline] = useState("");
    const [ctcStipend, setCtcStipend] = useState("");
    const [finalOfferStatus, setFinalOfferStatus] = useState("Pending");
    const [isAnonymous, setIsAnonymous] = useState(false);
    // State for managing multiple placement rounds
    const [rounds, setRounds] = useState([
        { round_type: 'assessment', round_name: '', difficulty: 3, topics_covered: '', sections: '', pass_status: 'waiting', tips: '' }
    ]);

    // --- Functions to manage placement rounds ---
    const addRound = () => {
        setRounds([...rounds, { round_type: 'assessment', round_name: '', difficulty: 3, topics_covered: '', sections: '', pass_status: 'waiting', tips: '' }]);
    };

    const removeRound = (index) => {
        setRounds(rounds.filter((_, i) => i !== index));
    };

    const updateRound = (index, field, value) => {
        const updatedRounds = [...rounds];
        updatedRounds[index][field] = value;
        setRounds(updatedRounds);
    };

    // --- Form Submission Handler ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!companyId || !positionAppliedFor || !batch) {
            setMessage("Please fill in all required fields (*).");
            return;
        }
        setLoading(true);
        setMessage("");

        // Find the selected company from the static list
        const selectedCompany = staticCompanies.find(c => c._id === companyId);

        const payload = {
            // Note: Your backend expects a real MongoDB ObjectId for companyId.
            // Using a static ID like '1' will cause a crash on the backend.
            // This frontend will work, but you'll need to adjust your backend to handle static names
            // or seed your database with these companies to get real IDs.
            companyId: selectedCompany._id, 
            companyName: selectedCompany.name,
            positionAppliedFor, batch, timeline, ctcStipend,
            finalOfferStatus, rounds, isAnonymous,
            createdBy: studentData?.name || "Student User",
        };

        try {
            const response = await fetch(`${backendUrl}/placement-reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                // Optionally reset the form fields here
            } else {
                setMessage(data.message || "Submission failed.");
            }
        } catch (error) {
            setMessage("A network error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="placement-review-form">
            <div className="review-card">
                 <h4 className="review-card-title">Basic Information</h4>
                 
                 <label>Company *</label>
                 <select value={companyId} onChange={e => setCompanyId(e.target.value)} required>
                    <option value="" disabled>Select a company</option>
                    {/* The dropdown now maps over the static company list */}
                    {staticCompanies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                 </select>
                 
                 <label>Position Applied For *</label>
                 <input type="text" value={positionAppliedFor} onChange={e => setPositionAppliedFor(e.target.value)} required placeholder="e.g., Software Engineer Intern" />

                 <label>Batch *</label>
                 <input type="text" value={batch} onChange={e => setBatch(e.target.value)} required placeholder="e.g., 2025" />
                 
                 <label>Timeline</label>
                 <input type="text" value={timeline} onChange={e => setTimeline(e.target.value)} placeholder="e.g., August - September 2023" />

                 <label>CTC/Stipend</label>
                 <input type="text" value={ctcStipend} onChange={e => setCtcStipend(e.target.value)} placeholder="e.g., 12 LPA or 50k/month" />
                 
                 <label>Final Offer Status</label>
                 <select value={finalOfferStatus} onChange={e => setFinalOfferStatus(e.target.value)}>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected by me">Rejected by me</option>
                    <option value="Rejected by company">Rejected by company</option>
                    <option value="Pending">Pending</option>
                 </select>
                 
                 <div className="anonymous-checkbox-container">
                        <input type="checkbox" id="anonymous" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
                        <label htmlFor="anonymous">Post anonymously</label>
                    </div>
            </div>

            <div className="review-card">
                <h4 className="review-card-title">Placement Rounds</h4>
                {rounds.map((round, index) => (
                    <div key={index} className="round-card">
                        <div className="round-header">
                            <h5>Round {index + 1}</h5>
                            {rounds.length > 1 && <button type="button" className="delete-round-btn" onClick={() => removeRound(index)}><Trash2 size={16}/></button>}
                        </div>
                        <label>Round Type</label>
                        <select value={round.round_type} onChange={e => updateRound(index, 'round_type', e.target.value)}>
                            <option value="assessment">Online Assessment</option>
                            <option value="coding">Coding Round</option>
                            <option value="technical_interview">Technical Interview</option>
                            <option value="hr_interview">HR Interview</option>
                            <option value="other">Other</option>
                        </select>
                        
                        <label>Round Name</label>
                        <input type="text" value={round.round_name || ""} onChange={e => updateRound(index, 'round_name', e.target.value)} placeholder="e.g., DSA Coding Test" />
                        
                        <label>Difficulty (1-5)</label>
                        <input type="number" min="1" max="5" value={round.difficulty} onChange={e => updateRound(index, 'difficulty', parseInt(e.target.value))} />

                        <label>Topics Covered</label>
                        <textarea value={round.topics_covered || ""} onChange={e => updateRound(index, 'topics_covered', e.target.value)} placeholder="e.g., Arrays, Strings, Dynamic Programming" />

                        <label>Sections / Questions Asked</label>
                        <textarea value={round.sections || ""} onChange={e => updateRound(index, 'sections', e.target.value)} placeholder="e.g., 3 coding questions, 20 MCQs" />
                        
                        <label>Pass Status</label>
                        <select value={round.pass_status || ""} onChange={e => updateRound(index, "pass_status", e.target.value)}>
                            <option value="passed">Passed</option>
                            <option value="failed">Failed</option>
                            <option value="waiting">Waiting</option>
                        </select>

                        <label>Tips & Advice</label>
                        <textarea value={round.tips || ""} onChange={e => updateRound(index, "tips", e.target.value)} placeholder="Share your preparation tips and advice" rows={3}/>
                    </div>
                ))}
                <button type="button" className="add-round-btn" onClick={addRound}>
                    <Plus size={16}/> Add Round
                </button>
            </div>

            <button type="submit" disabled={loading} className="submit-review-btn">
                {loading ? <Loader2 className="animate-spin" /> : "Submit Review"}
            </button>
            {message && <p className={`form-message ${message.includes("success") ? 'success' : 'error'}`}>{message}</p>}
        </form>
    );
};

export default PlacementReviewForm;

