// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// === Database Connection ===
// IMPORTANT: Replace the connection string with your own MongoDB URI.
// For a local MongoDB instance, it's typically 'mongodb://localhost:27017/asca_db'.
const MONGODB_URI = 'mongodb://localhost:27017/asca_db';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// === User Schema and Model ===
// This defines the structure of a student document in the database.
// The `name` field has been added to match the seeder file.
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['asca', 'student', 'committee', 'mca-student'] },
});

const User = mongoose.model('User', userSchema);

// Main route
app.get('/', (req, res) => {
  res.send('ASCA Backend is Running!');
});

// === Login and Registration Routes ===

// New route to register a user
app.post('/register', async (req, res) => {
  const { email, password, name, role } = req.body;
  try {
    const newUser = new User({ email, password, name, role });
    await newUser.save();
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
});

// Login for ASCA members (updated to use the name field)
app.post('/login', async (req, res) => {

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password, role: 'asca' });
    if (user) {
      // Now returns the user's name from the database
      return res.json({ success: true, role: user.role, name: user.name });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid ASCA credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

// Login for Students (updated to use the name field)
app.post('/student-login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password, role: 'student' });
    if (user) {
      // Now returns the user's name from the database
      return res.json({ success: true, role: user.role, name: user.name });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid student credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

// Login for ASCA Committee members (updated to use the name field)
app.post('/committee-login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password, role: 'committee' });
    if (user) {
      // Now returns the user's name from the database
      return res.json({ success: true, role: user.role, name: user.name });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid committee credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

// Login for MCA Students (Alumni) (updated to use the name field)
app.post('/mca-students-login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password, role: 'mca-student' });
    if (user) {
      // Now returns the user's name from the database
      return res.json({ success: true, role: user.role, name: user.name });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid MCA student credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
