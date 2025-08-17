const express = require('express');

// Create a new router to handle finance-specific routes
const router = express.Router();

// === Helper function to fetch Google Sheets data ===
async function fetchGoogleSheet(range) {
  const SHEET_ID = process.env.SHEET_ID;
  const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
  const RANGE = range || 'Sheet1!A1:F100';

  if (!API_KEY || !SHEET_ID) {
    throw new Error("Google Sheets API not configured. Please set GOOGLE_SHEETS_API_KEY and SHEET_ID in .env file.");
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
  
  try {
    // --- UPDATE: Using fetch() to get the data ---
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from Google Sheets API:", errorData);
      throw new Error(`Failed to fetch data from Google Sheets: ${errorData.error.message}`);
    }
    const jsonData = await response.json();
    return jsonData.values || [];
  } catch (error) {
    console.error("Network or fetch error:", error);
    throw new Error("Failed to connect to Google Sheets API.");
  }
}

// === Google Sheets API Routes ===

router.get('/balance-sheet', async (req, res) => {
  try {
    const values = await fetchGoogleSheet();
    if (values.length > 0) {
      res.json(values);
    } else {
      res.status(404).json({ error: "No data found in Google Sheets" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/income', async (req, res) => {
  try {
    const values = await fetchGoogleSheet();
    const incomeData = values.filter(row => {
      return row && row.length >= 4 && !isNaN(parseFloat(row[3])) && parseFloat(row[3]) > 0;
    });
    res.json(incomeData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/expenses', async (req, res) => {
  try {
    const values = await fetchGoogleSheet();
    const expenseData = values.filter(row => {
      return row && row.length >= 5 && !isNaN(parseFloat(row[4])) && parseFloat(row[4]) > 0;
    });
    res.json(expenseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export the router so it can be used by server.js
module.exports = router;
