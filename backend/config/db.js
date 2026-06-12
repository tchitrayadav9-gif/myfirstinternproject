const mongoose = require('mongoose');

global.useJsonDb = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.warn('\x1b[33m%s\x1b[0m', 'Warning: MONGODB_URI is not set in environment. Falling back to local JSON database.');
    global.useJsonDb = true;
    return;
  }

  try {
    // Attempt connection with short timeout to avoid hanging startup
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('\x1b[32m%s\x1b[0m', 'MongoDB Connected successfully.');
  } catch (err) {
    console.warn('\x1b[33m%s\x1b[0m', `Warning: Failed to connect to MongoDB (${err.message}).`);
    console.warn('\x1b[33m%s\x1b[0m', 'Gracefully falling back to local JSON database (files will persist in backend/database/json/).');
    global.useJsonDb = true;
  }
};

module.exports = connectDB;
