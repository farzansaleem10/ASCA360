const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Important: Make sure your models are loaded before this file is required in server.js
// If they are not, you might need to import them directly.
const PlacementReview = mongoose.models.PlacementReview;
const WorkReview = mongoose.models.WorkReview;

// --- NEW ROUTE: GET /api/reviews/companies ---
// This fetches all unique company names from both review collections.
router.get('/companies', async (req, res) => {
  try {
    // Check if models are loaded correctly
    if (!PlacementReview || !WorkReview) {
        return res.status(500).json({ success: false, message: 'Server error: Review models not found.' });
    }

    // Use `distinct` to get an array of unique company names from each collection
    const placementCompanyNames = await PlacementReview.distinct('companyName', { status: 'Approved' });
    const workCompanyNames = await WorkReview.distinct('companyName', { status: 'Approved' });

    // Combine the arrays and use a Set to ensure every name is unique
    const allCompanyNames = [...new Set([...placementCompanyNames, ...workCompanyNames])];
    
    // Create an array of objects that the frontend can easily use
    const companies = allCompanyNames.sort().map(name => ({
        // We use the name itself as a unique key for this list
        _id: name, 
        name: name
    }));

    res.json(companies);
  } catch (error) {
    console.error("Error fetching aggregated companies:", error);
    res.status(500).json({ success: false, message: 'Server error fetching aggregated companies.' });
  }
});
router.get('/companies-with-counts', async (req, res) => {
  try {
    if (!PlacementReview || !WorkReview) {
        return res.status(500).json({ success: false, message: 'Server error: Review models not found.' });
    }

    // Get unique company names from both collections
    const placementCompanies = await PlacementReview.distinct('companyName', { status: 'Approved' });
    const workCompanies = await WorkReview.distinct('companyName', { status: 'Approved' });
    const allCompanyNames = [...new Set([...placementCompanies, ...workCompanies])];

    // For each unique company, get the count of reviews
    const companiesWithCounts = await Promise.all(allCompanyNames.map(async (name) => {
        const placementReviewCount = await PlacementReview.countDocuments({ companyName: name, status: 'Approved' });
        const workReviewCount = await WorkReview.countDocuments({ companyName: name, status: 'Approved' });
        
        return {
            _id: name, // Using name as a unique ID for the list
            name: name,
            placementReviewCount: placementReviewCount,
            workReviewCount: workReviewCount
        };
    }));
    
    // Sort the final list alphabetically by company name
    res.json(companiesWithCounts.sort((a, b) => a.name.localeCompare(b.name)));

  } catch (error) {
    console.error("Error fetching companies with counts:", error);
    res.status(500).json({ success: false, message: 'Server error while fetching company counts.' });
  }
});


module.exports = router;