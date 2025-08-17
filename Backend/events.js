const express = require('express');
const mongoose = require('mongoose');

// --- UPDATE: Cloudinary and Multer are no longer needed in this file ---
// const cloudinary = require('cloudinary').v2;
// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

const router = express.Router();

// === Event Schema and Model (Updated) ===
const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  // --- UPDATE: Changed 'photos' array to 'driveFolderUrl' string ---
  driveFolderUrl: { type: String, required: true }, 
  createdBy: { type: String, required: true }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

// === API Routes (Updated) ===

/**
 * @route   POST /api/events
 * @desc    Create a new event using a Google Drive URL
 * @access  Committee only
 */
// --- UPDATE: Removed the 'upload.array()' middleware ---
router.post('/', async (req, res) => {
  try {
    // --- UPDATE: Get 'driveFolderUrl' from the request body ---
    const { eventName, description, date, driveFolderUrl, createdBy } = req.body;

    const newEvent = new Event({
      eventName,
      description,
      date,
      driveFolderUrl, // Save the URL to the database
      createdBy
    });

    await newEvent.save();
    res.status(201).json({ success: true, message: 'Event created successfully!', data: newEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/events
 * @desc    Get all events
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Export the router so server.js can use it
module.exports = router;
