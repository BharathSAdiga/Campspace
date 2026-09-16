require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Initialize database connection
connectDB();

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 CampusConnect Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/v1/health`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/v1/auth`);
  console.log(`=========================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('[Unhandled Rejection]', err.message);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]', err.message);
  process.exit(1);
});
