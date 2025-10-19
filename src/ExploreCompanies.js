import React, { useState } from 'react';
import './Placement.css';
import { Search, ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Static list of companies with descriptions to match the detailed view
const staticCompanies = [
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
    // In a real app, you would fetch these counts from the backend
    const reviewCounts = { placement: 0, work_experience: 0 };

    return (
        <div className="company-detail-view">
            <button onClick={onBack} className="back-button"><ArrowLeft size={16} /> Back to Companies</button>
            
            <div className="company-detail-header">
                <div className="company-logo-placeholder">
                    <span>{company.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="company-header-info">
                    <h2>{company.name}</h2>
                    <p className="company-description">{company.description || "No description available."}</p>
                    {company.website && <a href={company.website} target="_blank" rel="noopener noreferrer" className="company-website-link">Visit Website</a>}
                </div>
            </div>

            <div className="review-link-grid">
                {/* Placement Process Card */}
                <Link to={`/company/${company.slug}/placement`} className="review-link-card">
                    <div className="review-card-content">
                        <h3>Placement Process</h3>
                        <p>({reviewCounts.placement}) Reviews</p>
                    </div>
                    <ChevronRight className="chevron-icon" />
                </Link>

                {/* Work Experience Card */}
                <Link to={`/company/${company.slug}/work`} className="review-link-card">
                     <div className="review-card-content">
                        <h3>Work Experience</h3>
                        <p>({reviewCounts.work_experience}) Reviews</p>
                    </div>
                    <ChevronRight className="chevron-icon" />
                </Link>
            </div>
        </div>
    );
};


// This is the main component that shows the search bar and company grid
const ExploreCompanies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);

  const filteredCompanies = staticCompanies.filter((company) =>
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
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
              <div
              key={company._id}
              className="company-card"
              onClick={() => setSelectedCompany(company)}
              >
              <h3>{company.name}</h3>
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

