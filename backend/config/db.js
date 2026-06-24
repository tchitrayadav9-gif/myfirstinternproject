const mongoose = require('mongoose');

global.useJsonDb = false;
let isConnected = false;

const connectDB = async () => {
  if (global.useJsonDb) {
    return;
  }

  if (isConnected) {
    console.log('MongoDB: Using existing database connection cache.');
    return;
  }

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.warn('WARNING: MONGODB_URI is not set in environment. Falling back to Local JSON database.');
    global.useJsonDb = true;
    return;
  }

  try {
    console.log('MongoDB: Initializing new connection to Cloud Atlas...');
    const db = await mongoose.connect(mongoURI);
    isConnected = db.connections[0].readyState;
    console.log('MongoDB Connected successfully to Cloud Atlas.');
  } catch (err) {
    console.error(`CRITICAL: Failed to connect to MongoDB Atlas (${err.message}). Falling back to Local JSON database.`);
    global.useJsonDb = true;
  }
};

module.exports = connectDB;
