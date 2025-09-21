const mongoose = require('mongoose');

// The connection string for your MongoDB database.
// Make sure this matches the one in your server.js file.
const MONGODB_URI = process.env.MONGODB_URI;

// === User Schema and Model ===
// This schema must match the one in your server.js file exactly.
// It now includes the 'role' field.
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['asca', 'student', 'committee', 'mca-student'] }
});

const User = mongoose.model('User', userSchema);

// An array of users to be inserted into the database.
// Each user has a specific role defined.
const usersToSeed = [
  { name: 'ASCA Admin', email: 'asca@example.com', password: '123456', role: 'asca' },
];

const seedDatabase = async () => {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
    
    // Iterate through the array and add each user if they don't already exist
    for (const user of usersToSeed) {
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
            await User.create(user);
            console.log(`Successfully inserted user: ${user.email}`);
        } else {
            console.log(`User already exists: ${user.email}. Skipping insertion.`);
        }
    }
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    // Disconnect from the database when the script finishes
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

// Run the seeder function
seedDatabase();
