// complaints.js

const express = require('express');
const mongoose = require('mongoose');

// Create an Express router to define the API routes
const router = express.Router();

// === Complaint Schema and Model ===
// This schema defines the structure for a complaint document in MongoDB.
const complaintSchema = new mongoose.Schema({
  author: { 
    type: String, 
    required: true 
  },
  text: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed'], 
    default: 'pending' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Create the Mongoose model from the schema
const Complaint = mongoose.model('Complaint', complaintSchema);

// === API Routes ===

/**
 * @route   POST /api/complaints
 * @desc    Create a new complaint
 * @access  Student
 */
router.post('/', async (req, res) => {
  try {
    const { author, text } = req.body;

    const newComplaint = new Complaint({
      author,
      text,
    });

    await newComplaint.save();
    res.status(201).json({ success: true, message: 'Complaint submitted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/complaints
 * @desc    Get all complaints
 * @access  Admin
 */
router.get('/', async (req, res) => {
  try {
    // Fetch all complaints from the database, sorted by creation date
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

/**
 * @route   PUT /api/complaints/:id
 * @desc    Mark a complaint as completed
 * @access  Admin
 */
router.put('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 'completed' } },
      { new: true } // Return the updated document
    );

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.json({ success: true, message: 'Complaint marked as completed!', data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Export the router to be used in server.js
module.exports = router;
