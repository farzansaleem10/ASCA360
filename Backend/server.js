const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


// Load environment variables from the .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// === Database Connection ===
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/asca_db';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// === User Schema and Model ===
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

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password, role: 'asca' });
    if (user) {
      return res.json({ success: true, role: user.role, name: user.name });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid ASCA credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

app.post('/student-login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password, role: 'student' });
    if (user) {
      return res.json({ success: true, role: user.role, name: user.name });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid student credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

app.post('/committee-login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password, role: 'committee' });
    if (user) {
      return res.json({ success: true, role: user.role, name: user.name });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid committee credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

app.post('/mca-students-login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password, role: 'mca-student' });
    if (user) {
      return res.json({ success: true, role: user.role, name: user.name });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid MCA student credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

// === Helper function to fetch Google Sheets data ===
async function fetchGoogleSheet(range = 'Sheet1!A1:F100') {
  const SHEET_ID = process.env.SHEET_ID;
  const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
  const RANGE = range || process.env.SHEET_RANGE || 'Sheet1!A1:F100';

  if (!API_KEY || !SHEET_ID || API_KEY === 'YOUR_ACTUAL_API_KEY_HERE' || SHEET_ID === 'YOUR_ACTUAL_SHEET_ID_HERE') {
    throw new Error("Google Sheets API not configured. Please set GOOGLE_SHEETS_API_KEY and SHEET_ID in .env file.");
  }


  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
  console.log("Fetching data from Google Sheets:", url);
  const response = await fetch(url);
  console.log("sheet data : ", response);
  if (!response.ok) throw new Error("Failed to fetch data from Google Sheets");
  const jsonData = await response.json();
  return jsonData.values || [];
}


// === Google Sheets API Integration ===
app.get('/api/balance-sheet', async (req, res) => {
  try {
    const values = await fetchGoogleSheet();
    console.log('Fetched balance sheet data:', values);
    if (values.length > 0) {
      res.json(values);
    } else {
      res.status(404).json({ error: "No data found in Google Sheets" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/income', async (req, res) => {
  try {
    const values = await fetchGoogleSheet();
    // Filter for income entries (Credit > 0)
    const incomeData = values.filter(row => row.length >= 5 && parseFloat(row[3]) > 0);
    res.json(incomeData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/expenses', async (req, res) => {
  try {
    const values = await fetchGoogleSheet();
    // Filter for expense entries (Debit > 0)
    const expenseData = values.filter(row => row.length >= 5 && parseFloat(row[4]) > 0);
    res.json(expenseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Google Sheets integration enabled. Make sure to set GOOGLE_SHEETS_API_KEY and SHEET_ID in .env file.');
  console.log('No sample data - all financial data will be fetched from Google Sheets.');
});