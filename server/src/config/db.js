const mongoose = require('mongoose');
const config = require('./env');

let mongoMemoryServer = null;

/**
 * Connect to MongoDB database instance
 */
const connectDB = async () => {
  const mongoURI = config.mongodbUri;

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB] Could not connect to external MongoDB at ${mongoURI}.`);
    console.log(`[MongoDB] Starting fast in-memory MongoDB instance for development...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create({
        binary: {
          version: '6.0.14',
        },
      });
      const memoryUri = mongoMemoryServer.getUri();

      const conn = await mongoose.connect(memoryUri);
      console.log(`[MongoDB] Successfully connected to in-memory MongoDB at ${memoryUri}`);
      return conn;
    } catch (memError) {
      console.error(`[MongoDB] Database initialization error:`, memError.message);
      throw memError;
    }
  }
};

module.exports = connectDB;
