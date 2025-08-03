// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.send('ASCA Backend is Running!');
});

// Login example
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Dummy credentials
  if (email === 'asca@example.com' && password === '123456') {
    return res.json({ success: true, role: 'asca' });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
