const app = require('./app');
const config = require('./config/env');
const connectDB = require('./config/db');

const PORT = config.port;

// Initialize database connection
connectDB();

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`  Campspace Server`);
  console.log(`  Port:    ${PORT}`);
  console.log(`  Health:  http://localhost:${PORT}/api/health`);
  console.log(`  Env:     ${config.nodeEnv}`);
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
