const path = require('path');
const fs = require('fs');

// Resolve .env from server root (two levels up from src/config) or current working directory
const serverEnvPath = path.resolve(__dirname, '../../.env');
const cwdEnvPath = path.resolve(process.cwd(), '.env');

if (fs.existsSync(serverEnvPath)) {
  require('dotenv').config({ path: serverEnvPath });
} else if (fs.existsSync(cwdEnvPath)) {
  require('dotenv').config({ path: cwdEnvPath });
} else {
  require('dotenv').config();
}

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campspace',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'campspace_jwt_secret_dev_key_2024_secure',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
};

module.exports = config;
