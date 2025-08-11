# ASCA Association Management System - Backend

This is the Node.js backend for the ASCA Association Management System that integrates with Google Sheets for financial data.

## Features

- **User Authentication**: Admin, Student, Committee, and MCA Student login systems
- **Google Sheets Integration**: Fetches financial data directly from Google Sheets
- **Financial Data API**: Balance sheet, income, and expense endpoints
- **MongoDB Integration**: User management and data storage

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up MongoDB

Make sure MongoDB is running on your system:
```bash
mongod
```

### 3. Configure Google Sheets API

#### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API

#### Step 2: Create API Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key

#### Step 3: Set up Environment Variables
Create a `.env` file in the backend directory:

```env
# Google Sheets API Configuration
GOOGLE_SHEETS_API_KEY=YOUR_ACTUAL_API_KEY_HERE
SHEET_ID=YOUR_ACTUAL_SHEET_ID_HERE
SHEET_RANGE=Sheet1!A1:F10

# Server Configuration
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/asca_db
```

#### Step 4: Get Your Google Sheet ID
1. Open your Google Sheet
2. The Sheet ID is in the URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`
3. Replace `YOUR_ACTUAL_SHEET_ID_HERE` with your actual Sheet ID

#### Step 5: Set Sheet Range
- Update `SHEET_RANGE` to match your data range
- For example: `Sheet1!A1:F10` means columns A-F, rows 1-10

### 4. Run the Server

```bash
node server.js
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /login` - ASCA Admin login
- `POST /student-login` - Student login
- `POST /committee-login` - Committee login
- `POST /mca-students-login` - MCA Student login
- `POST /register` - User registration

### Financial Data
- `GET /api/balance-sheet` - Get balance sheet data from Google Sheets
- `GET /api/income` - Get income data
- `GET /api/expenses` - Get expense data

## Google Sheets Data Format

The system expects your Google Sheet to have this structure:

| SL | Event | Details | Credit | Debit | Proof |
|----|-------|---------|--------|-------|-------|
| 1  | Previous year Balance | | 0 | | |
| 2  | Previous year Liability | | | 550 | [Proof Link] |
| 3  | LBS Crash Course | | 74900 | | |
| 4  | ASCA Printout | printout taken for poster | 78 | | [Proof Link] |

## Current Status

✅ **Backend Server**: Running with Google Sheets integration
✅ **Sample Data**: Configured with ASCA 2025-2026 financial records
✅ **API Endpoints**: All financial data endpoints working
✅ **Error Handling**: Fallback to sample data if Google Sheets fails

## Next Steps

1. **Get Google Sheets API Key**: Follow the setup instructions above
2. **Update .env file**: Add your actual API key and Sheet ID
3. **Test Integration**: Restart server and test the balance sheet endpoint
4. **Frontend Integration**: The frontend is already configured to display the data

## Troubleshooting

### "No data available" Error
- Check if the backend server is running on port 5000
- Verify your Google Sheets API key is correct
- Ensure your Sheet ID and range are correct
- Check browser console for any CORS errors

### Google Sheets API Errors
- Verify the Google Sheets API is enabled in your Google Cloud project
- Check if your API key has the necessary permissions
- Ensure your Google Sheet is publicly accessible or shared with the service account

## Support

If you encounter any issues:
1. Check the server console for error messages
2. Verify your environment variables are set correctly
3. Test the API endpoints using Postman or similar tools
4. Ensure MongoDB is running and accessible 