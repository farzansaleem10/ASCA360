// complaints.js

const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

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

const Complaint = mongoose.model('Complaint', complaintSchema);

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


router.get('/', async (req, res) => {
  try {
  
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 'completed' } },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.json({ success: true, message: 'Complaint marked as completed!', data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
