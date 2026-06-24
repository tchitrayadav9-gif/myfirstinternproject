const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment configurations
dotenv.config();

const app = express();

// Register Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://myfirstinternproject.vercel.app',
  'https://avon-smart-portal.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origin.startsWith('http://localhost:') || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS Policy: Origin not allowed.'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Global database connection middleware for Serverless Function compatibility
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Root route check
app.get('/', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Avon Technologies Smart Portal API is live.',
    database: global.useJsonDb ? 'Local JSON Fallback File DB' : 'MongoDB Connection Active'
  });
});

// Mount API Routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/schedules', require('./routes/scheduleRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  console.error('Server error details:', err);
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

// Register Error Handler
app.use(errorHandler);

// Only listen on port if NOT running on Vercel serverless environment
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log('---------------------------------------------------------');
    console.log(` Avon Smart Portal API Server is running on port ${PORT}`);
    console.log(` Active DB State: ${global.useJsonDb ? 'JSON database fallback mode' : 'MongoDB mode'}`);
    console.log('---------------------------------------------------------');
  });
}

// Export the Express app for Vercel Serverless Functions
module.exports = app;
