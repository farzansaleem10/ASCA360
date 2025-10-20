import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import backendUrl from './config';
import './Placement.css';
// --- NEW: Import icons for the meta line ---
import { User, Calendar, Clock } from 'lucide-react';

// Static company list (no change)
const staticCompanyDetails = [
  { _id: '1', name: 'Accenture', slug: 'accenture', website: 'https://www.accenture.com', description: 'Accenture is a global professional services company that provides consulting, technology, and outsourcing solutions to help businesses improve performance and drive digital transformation.' },
  { _id: '2', name: 'Soti', slug: 'soti', website: 'https://soti.net/', description: 'SOTI is a proven leader at creating innovative solutions that reduce the cost and complexity of business-critical mobility and the IoT.' },
  { _id: '3', name: 'Electrifex', slug: 'electrifex', website: '', description: 'A technology company specializing in electrification solutions.' },
  { _id: '4', name: 'Federal Bank', slug: 'federal-bank', website: 'https://www.federalbank.co.in/', description: 'A major Indian commercial bank in the private sector.' },
  { _id: '5', name: 'Mitsogo', slug: 'mitsogo', website: 'https://www.mitsogo.com/', description: 'Mitsogo is a global organization that has been developing IT security solutions for over a decade.' },
  { _id: '6', name: 'J&J Sourcing', slug: 'jj-sourcing', website: '', description: 'A sourcing and procurement services company.' },
  { _id: '7', name: 'LTI Mindtree', slug: 'lti-mindtree', website: 'https://www.ltimindtree.com/', description: 'A global technology consulting and digital solutions company.' },
  { _id: '8', name: 'Nalasha', slug: 'nalasha', website: '', description: 'A software development and IT consulting company.' },
  { _id: '9', name: 'Quantiphi', slug: 'quantiphi', website: 'https://quantiphi.com/', description: 'An award-winning AI-first digital engineering company.' },
  { _id: '10', name: 'TCS', slug: 'tcs', website: 'https://www.tcs.com/', description: 'Tata Consultancy Services is an IT services, consulting and business solutions organization.' }
];

// -----------------------------------------------------------------
// --- NEW: ReviewCard Sub-Component ---
// This component renders a single card and manages its expanded state
// -----------------------------------------------------------------
const ReviewCard = ({ review, type }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isPlacement = type === 'placement';
  
  // --- Data mapping ---
  const title = isPlacement ? review.positionAppliedFor : review.jobTitle;
  const ctc = isPlacement ? (review.ctcStipend || 'N/A') : 'N/A';
  const timeline = isPlacement ? (review.timeline || null) : null;
  const status = isPlacement ? (review.finalOfferStatus || '') : '';
  const author = review.isAnonymous ? 'Anonymous' : (review.createdBy || 'Alumni');

  // --- Badge logic ---
  let statusClass = '';
  let badgeText = '';

  if (status.toLowerCase().includes('accepted') || status.toLowerCase().includes('offer')) {
    statusClass = 'status-accepted';
    badgeText = 'Accepted';
  } else if (status.toLowerCase().includes('rejected')) {
    statusClass = 'status-rejected';
    badgeText = 'Rejected by company';
  }
  // You can add more 'else if' for other statuses

  return (
    <div className={`review-card-item ${statusClass}`}>
      <div className="review-card-header">
        {/* --- Left side: Title, Meta, CTC --- */}
        <div className="review-header-left">
          <h4>{title}</h4>
          <div className="review-meta">
            <span><User size={14} /> {author}</span>
            <span><Calendar size={14} /> {review.batch}</span>
            {timeline && <span><Clock size={14} /> {timeline}</span>}
          </div>
          {isPlacement && (
            <div className="review-ctc">
              <strong>CTC/Stipend:</strong> {ctc}
            </div>
          )}
        </div>
        
        {/* --- Right side: Badge --- */}
        {badgeText && (
          <div className={`review-badge ${statusClass}`}>
            {badgeText}
          </div>
        )}
      </div>
      
      {/* --- Footer: View Details Toggle Button --- */}
      <div className="review-card-footer">
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Hide Details' : 'View  Details'}
        </button>
      </div>
      
      {/* --- Collapsible Details Section --- */}
      {isExpanded && (
        <div className="review-card-details">
          {/* --- Placement-Specific Details --- */}
          {isPlacement && (
            <>
              <h5>Round Details:</h5>
              {review.rounds && review.rounds.length > 0 ? (
                <ul>
                  {review.rounds.map((round, idx) => (
                    <li key={idx}>
                      <strong>{round.round_type} {round.round_name ? `- ${round.round_name}` : ''}</strong>
                      {round.topics_covered && <p>Topics: {round.topics_covered}</p>}
                      {round.difficulty && <p>Difficulty: {round.difficulty}/5</p>}
                      {round.tips && <p>Tips: {round.tips}</p>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No round details provided.</p>
              )}
            </>
          )}

          {/* --- Work Experience-Specific Details --- */}
          {!isPlacement && (
            <>
              <h5>Work Experience Details:</h5>
              {review.workLifeBalance && <p><strong>Work-life Balance:</strong> {review.workLifeBalance}/5</p>}
              {review.cultureRating && <p><strong>Culture:</strong> {review.cultureRating}/5</p>}
              {/* Add any other work-review fields here */}
            </>
          )}
        </div>
      )}
    </div>
  );
};

// -----------------------------------------------------------------
// --- Main CompanyReviews Component (Updated) ---
// -----------------------------------------------------------------
const CompanyReviews = () => {
  const { slug, type } = useParams();
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // --- 1. Find the company from the static list ---
    const c = staticCompanyDetails.find((s) => s.slug === slug);
    if (!c) {
      setError('Company not found');
      setLoading(false);
      return;
    }
    setCompany(c);

    // --- 2. Determine API URL ---
    const encodedName = encodeURIComponent(c.name);
    let url = '';
    if (type === 'placement') url = `${backendUrl}/placement-reviews/company/${encodedName}`;
    else if (type === 'work') url = `${backendUrl}/work-reviews/company/${encodedName}`;
    else {
      setError('Invalid review type');
      setLoading(false);
      return;
    }

    // --- 3. Fetch Data ---
    setLoading(true);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setReviews(Array.isArray(data) ? data : []);
// Filter for approved reviews *just in case* backend didn't
        // setReviews(Array.isArray(data) ? data.filter(r => r.status === 'Approved') : []);
      })
      .catch((err) => {
        console.error('Error fetching reviews:', err);
        setError('Failed to fetch reviews from server');
      })
      .finally(() => setLoading(false));
  }, [slug, type]);

  // --- Main Render ---
  return (
    <div className="placement-container">
      {/* --- Back Button --- */}
      <Link to="/explore">
        <button className="back-button">Back to Companies</button>
_     </Link>

      {/* --- Page Header --- */}
      {company && (
        <div className="company-detail-view" style={{marginTop: 0}}>
          <div className="company-detail-header">
            <div className="company-logo-placeholder"><span>{company.name.charAt(0).toUpperCase()}</span></div>
            <div className="company-header-info">
              <h2>{company.name} - {type === 'placement' ? 'Placement Process Reviews' : 'Work Experience Reviews'}</h2>
              <p className="company-description" style={{color: 'var(--text-secondary)', marginBottom: 0}}>
                {reviews.length} review{reviews.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>

          {/* --- Review List --- */}
          {loading && <p>Loading reviews…</p>}
          {error && <p className="empty-list-message">{error}</p>}

          {!loading && !error && (
            <div className="reviews-list">
              {reviews.length === 0 && <p className="empty-list-message">No {type} reviews available yet.</p>}
              {/* --- Use the new ReviewCard component --- */}
              {reviews.map((r) => (
                <ReviewCard key={r._id} review={r} type={type} />
             ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyReviews;