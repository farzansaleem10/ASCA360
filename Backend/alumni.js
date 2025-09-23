const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt');
const router = express.Router();

// Configure Cloudinary (ensure credentials are in your .env file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'alumni_registrations',
    allowed_formats: ['jpg', 'png', 'pdf'],
    public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
  },
});

const upload = multer({ storage: storage });

// === Alumni Schema with Status Field ===
const alumniSchema = new mongoose.Schema({
  photoUrl: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String},
  password: { type: String},
  graduationYear: { type: String },
  linkedin: { type: String },
  github: { type: String },
  // Assuming you have these schemas defined from previous steps
  // currentWorkplace: currentWorkplaceSchema,
  // experiences: [experienceSchema],
  pgCertificateUrl: { type: String},
  // Status field for the approval workflow
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

const Alumni = mongoose.model('Alumni', alumniSchema);

// === API Routes ===

// POST /register - saves new alumni with a 'pending' status
router.post('/register', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'pgCertificate', maxCount: 1 }]), async (req, res) => {
    try {
        if (!req.files || !req.files.photo || !req.files.pgCertificate) {
            return res.status(400).json({ success: false, message: 'Photo and PG Certificate are mandatory.' });
        }

        const photoUrl = req.files.photo[0].path;
        const pgCertificateUrl = req.files.pgCertificate[0].path;
        const { firstName, lastName, email, password, graduationYear, linkedin, github, currentWorkplace, experiences } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAlumni = new Alumni({
            photoUrl,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            graduationYear,
            linkedin,
            github,
            // currentWorkplace: JSON.parse(currentWorkplace),
            // experiences: JSON.parse(experiences),
            pgCertificateUrl,
            status: 'pending' // Explicitly set to pending
        });

        await newAlumni.save();
        res.status(201).json({ success: true, message: 'Alumni registered successfully! Your application is pending review.' });
    } catch (error) {
    console.error("Error while saving fund request:", error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting request.',
      error: error.message
    });
}
});


/**
 * @route   GET /api/alumni/pending
 * @desc    Get all alumni registrations with 'pending' status
 * @access  Admin/Committee only
 */
router.get('/pending', async (req, res) => {
  try {
    const pendingAlumni = await Alumni.find({ status: 'pending' }).select('-password').sort({ createdAt: -1 });
    res.json(pendingAlumni);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error while fetching pending alumni.' });
  }
});

/**
 * @route   PUT /api/alumni/status/:id
 * @desc    Update an alumnus's registration status
 * @access  Admin/Committee only
 */
router.put('/status/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const updatedAlumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    );

    if (!updatedAlumni) {
      return res.status(404).json({ success: false, message: 'Alumni not found.' });
    }
    res.json({ success: true, message: `Alumni status updated to ${status}.` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error while updating status.' });
  }
});

module.exports = router;

