const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt'); // <-- NEW: Import bcrypt for password hashing
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

// === Updated Alumni Schema ===
const currentWorkplaceSchema = new mongoose.Schema({
    institution: String,
    designation: String
});

const experienceSchema = new mongoose.Schema({
    institution: String,
    years: String,
    designation: String,
});

const alumniSchema = new mongoose.Schema({
  photoUrl: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // <-- NEW: Added password field
  graduationYear: { type: String, required: true },
  linkedin: { type: String },
  github: { type: String },
  currentWorkplace: currentWorkplaceSchema,
  experiences: [experienceSchema],
  pgCertificateUrl: { type: String, required: true },
}, { timestamps: true });

const Alumni = mongoose.model('Alumni', alumniSchema);

// === API Routes ===
router.post('/register', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'pgCertificate', maxCount: 1 }]), async (req, res) => {
  try {
    if (!req.files || !req.files.photo || !req.files.pgCertificate) {
        return res.status(400).json({ success: false, message: 'Photo and PG Certificate are mandatory.' });
    }

    const photoUrl = req.files.photo[0].path;
    const pgCertificateUrl = req.files.pgCertificate[0].path;
    
    // Get the new "password" field from the request body
    const { firstName, lastName, email, password, graduationYear, linkedin, github, currentWorkplace, experiences } = req.body;

    // --- NEW: Hash the password before saving ---
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const parsedCurrentWorkplace = JSON.parse(currentWorkplace);
    const parsedExperiences = JSON.parse(experiences);

    const newAlumni = new Alumni({
        photoUrl,
        firstName,
        lastName,
        email,
        password: hashedPassword, // <-- NEW: Save the hashed password
        graduationYear,
        linkedin,
        github,
        currentWorkplace: parsedCurrentWorkplace,
        experiences: parsedExperiences,
        pgCertificateUrl,
    });

    await newAlumni.save();

    res.status(201).json({ success: true, message: 'Alumni registered successfully!' });
  } catch (error) {
    console.error('Alumni registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
  }
});

module.exports = router;


