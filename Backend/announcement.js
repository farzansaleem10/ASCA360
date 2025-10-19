// announcements.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// --- SCHEMA UPDATED ---
const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdBy: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  createdAt: { type: Date, default: Date.now }
});

const Announcement = mongoose.model('Announcement', announcementSchema);

// --- POST / (Create) ---
// Logic updated to set status based on creator
router.post('/', async (req, res) => {
  try {
    const { title, content, createdBy } = req.body;
    
    // Admin posts are auto-approved. Alumni posts are pending.
    const status = (createdBy === 'Asca Admin') ? 'Approved' : 'Pending';
    
    const newAnnouncement = new Announcement({
      title,
      content,
      createdBy,
      status, // Set the status here
    });
    
    await newAnnouncement.save();
    
    const message = (status === 'Approved') 
      ? 'Announcement created successfully!'
      : 'Announcement submitted for approval!';

    res.status(201).json({ success: true, message: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// --- GET / (Read for Public) ---
// This route now ONLY returns APPROVED announcements for public feeds.
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find({ status: 'Approved' }).sort({
      createdAt: -1
    });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// --- NEW: GET /all (Read for Admin & Alumni Dashboard) ---
// This route returns ALL announcements (Pending, Approved, Rejected)
router.get('/all', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({
      createdAt: -1
    });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// --- NEW: PUT /status/:id (Admin Approve/Reject) ---
router.put('/status/:id', async (req, res) => {
  try {
    const { status } = req.body; // Expects { status: 'Approved' } or { status: 'Rejected' }
    
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    res.json({ success: true, message: `Announcement ${status.toLowerCase()}!` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// --- PUT /:id (Admin Edit Content) ---
// This route is for ADMINS to edit title/content *without* changing status.
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, content }, // Only updates these two fields
      { new: true }
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    res.json({ success: true, message: 'Announcement updated successfully!', data: updatedAnnouncement });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// --- NEW: PUT /alumni-edit/:id (Alumni Edit Content) ---
// This route is for ALUMNI to edit, which RESETS status to 'Pending'
router.put('/alumni-edit/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, content, status: 'Pending' }, // Resets status to Pending
      { new: true }
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    res.json({ success: true, message: 'Announcement updated and resubmitted for approval!', data: updatedAnnouncement });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// --- DELETE /:id (Delete) ---
// This can be used by both Admin and Alumni
router.delete('/:id', async (req, res) => {
  try {
    const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);

    if (!deletedAnnouncement) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    res.json({ success: true, message: 'Announcement deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
A  }
});

module.exports = router;