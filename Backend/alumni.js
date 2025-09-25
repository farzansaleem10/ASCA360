const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt');
const { ChevronsLeftIcon } = require('lucide-react');
const router = express.Router();
// Make sure to import your Alumni model


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
// NOTE: I'm re-adding the schemas for currentWorkplace and experiences
// Ensure these are defined if you separated them previously.
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
  photoUrl: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  graduationYear: { type: String },
  linkedin: { type: String },
  github: { type: String },
  currentWorkplace: currentWorkplaceSchema,
  experiences: [experienceSchema],
  pgCertificateUrl: { type: String, required: true },
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
            currentWorkplace: JSON.parse(currentWorkplace),
            experiences: JSON.parse(experiences),
            pgCertificateUrl,
            status: 'pending'
        });

        await newAlumni.save();
        res.status(201).json({ success: true, message: 'Alumni registered successfully! Your application is pending review.' });
    } catch (error) {
        console.error('Alumni registration error:', error);
        res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
});


// GET /pending - Get all alumni registrations with 'pending' status
router.get('/pending', async (req, res) => {
  try {
    const pendingAlumni = await Alumni.find({ status: 'pending' }).select('-password').sort({ createdAt: -1 });
    res.json(pendingAlumni);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error while fetching pending alumni.' });
  }
});
router.get('/profile/:email', async (req, res) => {
    try {
        const alumni = await Alumni.findOne({ email: req.params.email }).select('-password');
        if (!alumni) {
            return res.status(404).json({ success: false, message: 'Alumni profile not found.' });
        }
        res.json(alumni);
    } catch (error) {
        console.error("Error fetching alumni profile:", error);
        res.status(500).json({ success: false, message: 'Server error while fetching profile.' });
    }
});

/**
 * @route   GET /api/alumni/approved
 * @desc    Get all approved alumni for the community page
 * @access  Public (for any logged-in user)
 */
router.get('/approved', async (req, res) => {
  try {
    // --- UPDATED: Changed the .select() to include more fields for the detailed view ---
    const approvedAlumni = await Alumni.find({ status: 'approved' })
      .select('firstName lastName photoUrl graduationYear linkedin github email currentWorkplace experiences')
      .sort({ graduationYear: -1, firstName: 1 });
    res.json(approvedAlumni);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error while fetching alumni community.' });
  }
});


// PUT /status/:id - Update an alumnus's registration status
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

router.post("/login", async (req, res) => {

  const { email, password } = req.body;
 
  try {
    const alumni = await Alumni.findOne({ email });
    if (!alumni) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, alumni.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (alumni.status !== "approved") {
      return res.status(403).json({ success: false, message: "Your registration is pending or has been rejected." });
    }

    return res.json({ success: true, role: "alumni", name: alumni.email });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error during login." });
  }
});


/**
 * --- NEW: THIS ROUTE WAS MISSING ---
 * @route   PUT /api/announcements/:id
 * @desc    Update an existing announcement
 * @access  Admin/Alumni
 */

/**
 * --- ADDED: This route was missing ---
 * @route   PUT /api/announcements/:id
 * @desc    Update an existing announcement
 * @access  Admin/Alumni
 */
router.put('/:id', async (req, res) => {
    try {
        const { title, content, createdBy } = req.body;
        const updatedAnnouncement = await Announcement.findByIdAndUpdate(
            req.params.id,
            { title, content, createdBy },
            { new: true } // This option returns the updated document
        );

        if (!updatedAnnouncement) {
            return res.status(404).json({ success: false, message: 'Announcement not found.' });
        }

        res.json({ success: true, message: 'Announcement updated successfully!', data: updatedAnnouncement });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error while updating announcement.' });
    }
});


/**
 * --- ADDED: This route was missing ---
 * @route   DELETE /api/announcements/:id
 * @desc    Delete an announcement
 * @access  Admin/Alumni
 */
router.delete('/:id', async (req, res) => {
  console.log(deletedAnnouncement);
    try {
        const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);
        

        if (!deletedAnnouncement) {
            return res.status(404).json({ success: false, message: 'Announcement not found.' });
        }

        res.json({ success: true, message: 'Announcement deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error while deleting announcement.' });
    }
});
 
router.put('/:id', async (req, res) => {
    try {
        const updatedAlumni = await Alumni.findByIdAndUpdate(
            req.params.id,
            req.body, // Allows updating any field from the body
            { new: true }
        ).select('-password'); // Exclude password from the response

        if (!updatedAlumni) {
            return res.status(404).json({ success: false, message: 'Alumni not found.' });
        }

        res.json({ success: true, message: 'Alumni profile updated successfully!', data: updatedAlumni });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error while updating alumni profile.' });
    }
});


/**
 * --- NEW ROUTE ---
 * @route   DELETE /api/alumni/:id
 * @desc    Delete an alumnus's profile
 * @access  Admin/Committee only
 */
router.delete('/:id', async (req, res) => {
    try {
        const deletedAlumni = await Alumni.findByIdAndDelete(req.params.id);

        if (!deletedAlumni) {
            return res.status(404).json({ success: false, message: 'Alumni not found.' });
        }

        // Optional: You might want to delete their files from Cloudinary here as well

        res.json({ success: true, message: 'Alumni profile deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error while deleting alumni profile.' });
    }
});



module.exports = router;

