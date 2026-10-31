const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    // Connect to MongoDB
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected successfully.');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.warn('WARNING: Running without an active MongoDB connection.');
    console.warn('To persist data permanently, provide a valid MONGO_URI in backend/.env (e.g. MongoDB Atlas free cluster connection string).');
  }
};

module.exports = connectDB;
