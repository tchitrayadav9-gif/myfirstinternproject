const mongoose = require('mongoose');

global.useJsonDb = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error('CRITICAL: MONGODB_URI is not set in environment. MongoDB Atlas connection is mandatory.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected successfully to Cloud Atlas.');
  } catch (err) {
    console.error(`CRITICAL: Failed to connect to MongoDB Atlas (${err.message}). Startup aborted.`);
    process.exit(1);
  }
};

module.exports = connectDB;
