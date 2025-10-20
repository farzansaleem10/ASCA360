import React, { useState, useEffect } from 'react';
import './Placement.css';
import { Search, ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// -----------------------------------------------------------------
// STEP 1: Bring back your static list with all the details.
// -----------------------------------------------------------------
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

// This sub-component renders the detailed view for a single company
const CompanyDetail = ({ company, onBack }) => {
  return (
    <div className="company-detail-view">
      <button onClick={onBack} className="back-button"><ArrowLeft size={16} /> Back to Companies</button>
      
      <div className="company-detail-header">
        <div className="company-logo-placeholder">
          <span>{company.name.charAt(0).toUpperCase()}</span>
        </div>
        <div className="company-header-info">
          <h2>{company.name}</h2>
          {/* --- DETAILS ARE NOW VISIBLE --- */}
          <p className="company-description">{company.description || "No description available."}</p>
          {company.website && <a href={company.website} target="_blank" rel="noopener noreferrer" className="company-website-link">Visit Website</a>}
        </div>
      </div>

      <div className="review-link-grid">
        {/* Placement Process Card */}
        {/* Use the slug for the link */}
        <Link to={`/company/${company.slug}/placement`} className="review-link-card">
          <div className="review-card-content">
            <h3>Placement Process</h3>
            {/* The count comes from the merged data */}
            <p>({company.placementReviewCount}) Reviews</p>
          </div>
          <ChevronRight className="chevron-icon" />
        </Link>

        {/* Work Experience Card */}
        {/* Use the slug for the link */}
        <Link to={`/company/${company.slug}/work`} className="review-link-card">
          <div className="review-card-content">
            <h3>Work Experience</h3>
            {/* The count comes from the merged data */}
            <p>({company.workReviewCount}) Reviews</p>
          </div>
          <ChevronRight className="chevron-icon" />
        </Link>
      </div>
    </div>
  );
};


// This is the main component
const ExploreCompanies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]); // This will hold the final MERGED list
  const [isLoading, setIsLoading] = useState(true);

  // --- STEP 2: Fetch counts AND merge with static data ---
  useEffect(() => {
    const fetchAndMergeData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/reviews/companies-with-counts');
        const dynamicData = await res.json(); // This is: [{ name, placementReviewCount, ... }]

        if (!Array.isArray(dynamicData)) {
          throw new Error("Fetched data is not an array");
        }

        // Create a Map of the dynamic counts for easy lookup
        // e.g., { "Accenture": { placementReviewCount: 5, ... }, "TCS": { ... } }
        const reviewCountsMap = new Map();
        dynamicData.forEach(company => {
          reviewCountsMap.set(company.name, {
            placementReviewCount: company.placementReviewCount,
            workReviewCount: company.workReviewCount
          });
        });

        // Merge static details with dynamic counts
        const mergedCompanies = staticCompanyDetails.map(staticCompany => {
          const counts = reviewCountsMap.get(staticCompany.name);

          return {
            ...staticCompany, // { _id, name, slug, description, website }
            placementReviewCount: counts ? counts.placementReviewCount : 0, // Add count, default to 0
            workReviewCount: counts ? counts.workReviewCount : 0 // Add count, default to 0
          };
        });

        setCompanies(mergedCompanies);

      } catch (err) {
        console.error("Error fetching or merging company data:", err);
        // Fallback: just use the static list with 0 counts
        setCompanies(staticCompanyDetails.map(c => ({ ...c, placementReviewCount: 0, workReviewCount: 0 })));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndMergeData();
  }, []); // Empty array means this runs once on mount

  // Filter the final merged list
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If a company is selected, show the detail view
  if (selectedCompany) {
    return <CompanyDetail company={selectedCompany} onBack={() => setSelectedCompany(null)} />;
  }
  
  // Otherwise, show the main grid view
  return (
    <div className="placement-container">
      <Link to="/student-dashboard">
        <button className="back-button"><ArrowLeft size={16} /> Back to Home</button>
      </Link>
      <div className="explore-header">
        <h2>Explore Companies</h2>
        <p>Find reviews for companies you're interested in.</p>
      </div>

      <div className="search-bar-container">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Search for a company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="company-grid">
        {isLoading ? (
          <p>Loading companies...</p>
        ) : filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <div
              key={company._id} // Use the static _id
              className="company-card"
              onClick={() => setSelectedCompany(company)} 
    _       >
              <h3>{company.name}</h3>
              {/* Now we can show the total count on the card */}
              
            </div>
          ))
        ) : (
          <p className="empty-list-message">No companies found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default ExploreCompanies;