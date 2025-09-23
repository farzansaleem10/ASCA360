const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// === Fund Request Schema and Model ===
// This defines the structure for the fund request documents in your database.
const fundRequestSchema = new mongoose.Schema({
studentName: { type: String, required: true },
  eventName: { type: String, required: true },
  purpose: { type: String, required: true },
  amount: { type: Number, required: true },
  upiId: { type: String, required: true },
  proofLink: { type: String, required: true },
  // Optional: You might want to track who submitted the request and its status
  // submittedBy: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
}, { timestamps: true }); // timestamps adds createdAt and updatedAt fields

const FundRequest = mongoose.model('FundRequest', fundRequestSchema);

// === API Routes ===

/**
 * @route   POST /api/funds
 * @desc    Create a new fund request
 * @access  Students
 */
router.post('/', async (req, res) => {
     console.log('Received fund request data:', req.body); 
  try {
    // Get the data from the frontend form submission
    const {studentName, eventName, purpose, amount, upiId, proofLink } = req.body;

    // Create a new fund request document
    const newFundRequest = new FundRequest({
    studentName,
      eventName,
      purpose,
      amount,
      upiId,
      proofLink,
      // If you are tracking the user, you would get the user's info
      // from the request (e.g., after they log in) and add it here.
      // submittedBy: req.user.name 
    });

    // Save the new request to the database
    await newFundRequest.save();
    
    res.status(201).json({ success: true, message: 'Fund request submitted successfully!', data: newFundRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error while submitting request.', error: error.message });
  }
});

/**
 * @route   GET /api/funds
 * @desc    Get all fund requests (for admin/committee view)
 * @access  Committee only
 */
router.get('/', async (req, res) => {
  try {
    // Find all fund requests and sort them by the most recent
    const requests = await FundRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error while fetching requests.', error: error.message });
  }
});

// Export the router so server.js can use it
module.exports = router;
