require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campspace',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

module.exports = config;
