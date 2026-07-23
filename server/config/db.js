const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows DNS SRV lookup issues with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Fallback if DNS server set fails
}

/**
 * Connect to MongoDB instance (Local or Atlas Cloud)
 */
const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookcase_db';
    const conn = await mongoose.connect(connStr);
    
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
