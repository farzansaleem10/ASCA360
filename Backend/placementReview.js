const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// 1. Define the Mongoose Schema for a single placement round
const placementRoundSchema = new mongoose.Schema({
  round_type: { type: String, required: true },
  round_name: { type: String },
  difficulty: { type: Number },
  topics_covered: { type: String },
  sections: { type: String },
  pass_status: { type: String },
  tips: { type: String },
});

// 2. Define the main Mongoose Schema for the entire placement review
const placementReviewSchema = new mongoose.Schema({
  // Basic Info from the form
  companyId: { type: String, required: true }, // Using String to accept static IDs like '1', '2'
  companyName: { type: String, required: true },
  positionAppliedFor: { type: String, required: true },
  batch: { type: String, required: true },
  timeline: { type: String },
  ctcStipend: { type: String },
  finalOfferStatus: { type: String },
  isAnonymous: { type: Boolean, default: false },
  
  // Embed the array of rounds directly into the review document
  rounds: [placementRoundSchema], 
  
  // Author & Status for admin approval
  createdBy: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  createdAt: { type: Date, default: Date.now }
});

// Use this check to prevent the "OverwriteModelError" during development
const PlacementReview = mongoose.models.PlacementReview || mongoose.model('PlacementReview', placementReviewSchema);

// 3. Create the POST Route to receive and save form submissions
router.post('/', async (req, res) => {
  try {
    // Create a new review document using the data sent from the frontend
    const newReview = new PlacementReview(req.body);
    await newReview.save();
    
    // Send a success response back to the frontend
    res.status(201).json({ 
      success: true, 
      message: 'Placement review submitted! It will be visible after admin approval.' 
    });
  } catch (error) {
    // Send an error response if something goes wrong
    console.error("Error saving placement review:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while submitting review.', 
      error: error.message 
    });
  }
});

// 4. (Optional but Recommended) Route to get approved reviews for a company
router.get('/company/:companyName', async (req, res) => {
    try {
        const reviews = await PlacementReview.find({ 
            companyId: req.params.companyId,
            status: 'Approved' 
        }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.put('/status/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status provided.' });
    }
    const updatedReview = await PlacementReview.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }
    res.json({ success: true, message: `Review has been ${status.toLowerCase()}.` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});
router.get('/pending', async (req, res) => {
  try {
    const pendingReviews = await PlacementReview.find({ status: 'Pending' }).sort({ createdAt: -1 });
    res.json(pendingReviews);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;