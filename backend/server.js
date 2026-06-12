const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment configurations
dotenv.config();

const app = express();

// Register Middleware
app.use(cors({
  origin: '*', // Allow frontend client requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  console.error('Server error details:', err);
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

const startServer = async () => {
  // Connect database
  await connectDB();

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

  // Register Error Handler
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log('\x1b[36m%s\x1b[0m', `---------------------------------------------------------`);
    console.log('\x1b[36m%s\x1b[0m', ` Avon Smart Portal API Server is running on port ${PORT}`);
    console.log('\x1b[36m%s\x1b[0m', ` Active DB State: ${global.useJsonDb ? 'JSON database fallback mode' : 'MongoDB mode'}`);
    console.log('\x1b[36m%s\x1b[0m', `---------------------------------------------------------`);
  });
};

startServer();
