const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// === Fund Request Schema and Model ===
// This defines the structure for the fund request documents in your database.
const fundRequestSchema = new mongoose.Schema({
  // NOTE: Changed studentName to submittedBy to match frontend and made fields required
  submittedBy: { type: String, required: true },
  eventName: { type: String, required: true },
  purpose: { type: String, required: true },
  amount: { type: Number, required: true },
  upiId: { type: String, required: true },
  proofLink: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected', 'completed'], // Added 'completed'
    default: 'pending'
  },
}, { timestamps: true });

const FundRequest = mongoose.model('FundRequest', fundRequestSchema);


router.post('/', async (req, res) => {
  console.log('Received fund request data:', req.body);
  try {
    const { submittedBy, eventName, purpose, amount, upiId, proofLink } = req.body;

    const newFundRequest = new FundRequest({
      submittedBy,
      eventName,
      purpose,
      amount,
      upiId,
      proofLink,
    });

    await newFundRequest.save();
    res.status(201).json({ success: true, message: 'Fund request submitted successfully!', data: newFundRequest });
  } catch (error) {
    console.error("Error while saving fund request:", error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting request.',
      error: error.message
    });
  }
});


router.get('/', async (req, res) => {
  try {
    const requests = await FundRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error while fetching requests.', error: error.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    // Validate the new status
    if (!['approved', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const updatedRequest = await FundRequest.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true } // This option returns the updated document
    );

    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: 'Fund request not found.' });
    }

    res.json({ success: true, message: 'Fund request status updated successfully!', data: updatedRequest });
  } catch (error) {
    console.error("Error updating fund request:", error);
    res.status(500).json({ success: false, message: 'Server error while updating request.', error: error.message });
  }
});


module.exports = router;

