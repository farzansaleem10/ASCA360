const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['asca', 'student', 'committee', 'mca-student'] }
});

const User = mongoose.model('User', userSchema);

const usersToSeed = [
  { name: 'ASCA Admin', email: 'asca@example.com', password: '123456', role: 'asca' },
];

const seedDatabase = async () => {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');

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
  
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

seedDatabase();
