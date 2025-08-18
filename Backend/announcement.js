// announcements.js
const express = require('express');
const mongoose = require('mongoose');

// Create a router for announcements
const router = express.Router();

// === Announcement Schema and Model ===
// The schema defines the structure for an announcement document in MongoDB.
const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Announcement = mongoose.model('Announcement', announcementSchema);

// === API Routes ===

/**
 * @route   POST /api/announcements
 * @desc    Create a new announcement
 * @access  Admin
 */
router.post('/', async (req, res) => {
  try {
    const { title, content, createdBy } = req.body;
    const newAnnouncement = new Announcement({
      title,
      content,
      createdBy,
    });
    await newAnnouncement.save();
    res.status(201).json({ success: true, message: 'Announcement created successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/announcements
 * @desc    Get all announcements
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // Sort announcements in descending order by creation date
    const announcements = await Announcement.find().sort({
      createdAt: -1
    });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Export the router so server.js can use it
module.exports = router;
