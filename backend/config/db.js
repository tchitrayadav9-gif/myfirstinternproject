const mongoose = require('mongoose');

global.useJsonDb = false;
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('MongoDB: Using existing database connection cache.');
    return;
  }

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    const errorMsg = 'CRITICAL: MONGODB_URI is not set in environment. MongoDB Atlas connection is mandatory.';
    console.error(errorMsg);
    throw new Error('MONGODB_URI environment variable is missing.');
  }

  try {
    console.log('MongoDB: Initializing new connection to Cloud Atlas...');
    const db = await mongoose.connect(mongoURI);
    isConnected = db.connections[0].readyState;
    console.log('MongoDB Connected successfully to Cloud Atlas.');
  } catch (err) {
    console.error(`CRITICAL: Failed to connect to MongoDB Atlas (${err.message}).`);
    throw err;
  }
};

module.exports = connectDB;
