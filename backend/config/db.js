const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error('CRITICAL: MONGODB_URI is not set in environment.');
    throw new Error('MONGODB_URI environment variable is missing.');
  }

  try {
    const db = await mongoose.connect(mongoURI);
    isConnected = db.connections[0].readyState;
    console.log('MongoDB Connected successfully to Cloud Atlas.');
  } catch (err) {
    console.error(`CRITICAL: Failed to connect to MongoDB Atlas (${err.message}).`);
    throw err;
  }
};

module.exports = connectDB;
