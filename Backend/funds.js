const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// === Fund Request Schema and Model ===
const fundRequestSchema = new mongoose.Schema({
  submittedBy: { type: String, required: true },
  eventName: { type: String, required: true },
  purpose: { type: String, required: true },
  amount: { type: Number, required: true },
  upiId: { type: String, required: true },
  proofLink: { type: String, required: true },
  // --- NEW FIELD for the bill number ---
  billNumber: { type: String, required: true, unique: true },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  rejectionReason: { type: String },
}, { timestamps: true });

const FundRequest = mongoose.model('FundRequest', fundRequestSchema);


// --- UPDATED POST ROUTE ---
// Now generates a unique 6-digit bill number for each request
router.post('/', async (req, res) => {
  console.log('Received fund request data:', req.body);
  try {
    const { submittedBy, eventName, purpose, amount, upiId, proofLink } = req.body;

    // --- Bill Number Generation Logic ---
    let billNumber;
    let isUnique = false;
    while (!isUnique) {
      // Generate a random 6-digit number as a string
      billNumber = Math.floor(100000 + Math.random() * 900000).toString();
      // Check if a request with this bill number already exists
      const existingRequest = await FundRequest.findOne({ billNumber });
      if (!existingRequest) {
        isUnique = true;
      }
    }

    const newFundRequest = new FundRequest({
      submittedBy,
      eventName,
      purpose,
      amount,
      upiId,
      proofLink,
     
    });

    await newFundRequest.save();
    // Return the full request data, including the new billNumber
    res.status(201).json({ success: true, message: 'Fund request submitted successfully!', data: newFundRequest });
  } catch (error) {
    console.error("Error while saving fund request:", error);
    res.status(500).json({ success: false, message: 'Server error while submitting request.' });
  }
});


// GET all requests (for admin)
router.get('/', async (req, res) => {
  try {
    const requests = await FundRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error while fetching requests.'});
  }
});

// PUT route to update status (for admin)
router.put('/status/:id', async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    if (!['approved', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }
    const updateData = { status };
    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }
    const updatedRequest = await FundRequest.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: 'Fund request not found.' });
    }
    res.json({ success: true, message: 'Fund request status updated successfully!', data: updatedRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error while updating request.'});
  }
});
router.get('/student/:studentName', async (req, res) => {
  try {
    const studentName = req.params.studentName;
    const requests = await FundRequest.find({ submittedBy: studentName }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error("Error fetching student's fund requests:", error);
    res.status(500).json({ success: false, message: 'Server error while fetching requests.' });
  }
});

// --- NEW GET ROUTE for tracking by bill number ---



module.exports = router;

