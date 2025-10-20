const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Define the Mongoose Schema for a Work Review
const workReviewSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  companyName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  batch: { type: String, required: true },
  isAnonymous: { type: Boolean, default: false },
  workLifeBalance: { type: Number },
  cultureRating: { type: Number },
  // Add other fields from your form
  createdBy: { type: String, required: true },
  alumniId: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumni' },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  createdAt: { type: Date, default: Date.now }
});

const WorkReview = mongoose.models.WorkReview || mongoose.model('WorkReview', workReviewSchema);

// POST / - Create a new review
router.post('/', async (req, res) => {
  try {
    const newReview = new WorkReview(req.body);
    await newReview.save();
    res.status(201).json({ 
      success: true, 
      message: 'Work review submitted! It will be visible after admin approval.' 
    });
  } catch (error) {
    console.error("Error saving work review:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while submitting review.', 
      error: error.message 
    });
  }
});

// GET /pending - Fetches all pending work reviews for the admin
router.get('/pending', async (req, res) => {
  try {
    const pendingReviews = await WorkReview.find({ status: 'Pending' }).sort({ createdAt: -1 });
    res.json(pendingReviews);
  } catch (error) {
    console.error("Error fetching pending work reviews:", error);
    res.status(500).json({ success: false, message: 'Server error fetching pending reviews.' });
  }
});

// PUT /status/:id - Allows an admin to approve or reject a work review
router.put('/status/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status provided.' });
    }
    const updatedReview = await WorkReview.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }
    res.json({ success: true, message: `Review has been ${status.toLowerCase()}.` });
  } catch (error) {
    console.error("Error updating review status:", error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});
router.get('/company/:companyName', async (req, res) => {
    try {
        // 1. Use the correct model: WorkReview
        const reviews = await WorkReview.find({ 
            // 2. Query by the companyName field
            // 3. Use the correct parameter: req.params.companyName
            companyName: req.params.companyName, 
            status: 'Approved' 
        }).sort({ createdAt: -1 });
        
        res.json(reviews); // This will now send the correct data

    } catch (error) {
        console.error("Error fetching work reviews by company:", error); // Added a better log
        res.status(500).json({ success: false, message: 'Server error' });
  T }
});
module.exports = router;

