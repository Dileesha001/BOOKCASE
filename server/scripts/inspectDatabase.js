const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Inventory = require('../models/Inventory');
const Log = require('../models/Log');
const Order = require('../models/Order');

const inspectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookcase_db';
    console.log(`\n=============================================================`);
    console.log(`🍃 MONGODB DATABASE INSPECTOR: bookcase_db`);
    console.log(`=============================================================\n`);

    await mongoose.connect(connStr);

    // List all Collections in database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📌 COLLECTIONS FOUND IN DATABASE (${collections.length}):`);
    collections.forEach(col => console.log(`   • ${col.name}`));
    console.log(`\n-------------------------------------------------------------\n`);

    // 1. Users Table / Collection
    const users = await User.find().select('-password').lean();
    console.log(`👤 1. USERS COLLECTION ('users') - Count: ${users.length}`);
    if (users.length > 0) {
      console.table(users.map(u => ({
        ID: u._id.toString().substring(0, 8) + '...',
        Username: u.username,
        Email: u.email,
        Role: u.role,
        FullName: u.profile ? u.profile.fullName : '',
        CreatedAt: new Date(u.createdAt).toLocaleString()
      })));
    } else {
      console.log(`   (No users recorded yet)`);
    }
    console.log(`\n-------------------------------------------------------------\n`);

    // 2. Logging Details Table / Collection
    const logs = await Log.find().sort({ createdAt: -1 }).limit(10).lean();
    const logCount = await Log.countDocuments();
    console.log(`📝 2. LOGGING DETAILS COLLECTION ('logs') - Total Count: ${logCount} (Showing latest 10)`);
    if (logs.length > 0) {
      console.table(logs.map(l => ({
        ID: l._id.toString().substring(0, 8) + '...',
        Level: l.level.toUpperCase(),
        Action: l.action,
        Message: l.message,
        IP: l.ipAddress,
        Timestamp: new Date(l.createdAt).toLocaleString()
      })));
    } else {
      console.log(`   (No log records found)`);
    }
    console.log(`\n-------------------------------------------------------------\n`);

    // 3. Inventory Table / Collection
    const inventory = await Inventory.find().lean();
    console.log(`📚 3. INVENTORY COLLECTION ('inventories') - Count: ${inventory.length}`);
    if (inventory.length > 0) {
      console.table(inventory.map(b => ({
        ID: b._id.toString().substring(0, 8) + '...',
        Title: b.title,
        Author: b.author,
        Category: b.category,
        Price_LKR: b.priceLKR,
        Stock_Status: b.stockStatus,
        Quantity: b.quantity
      })));
    } else {
      console.log(`   (No inventory items found)`);
    }
    console.log(`\n-------------------------------------------------------------\n`);

    // 4. Orders Table / Collection
    const orders = await Order.find().lean();
    console.log(`🛍️ 4. ORDERS COLLECTION ('orders') - Count: ${orders.length}`);
    if (orders.length > 0) {
      console.table(orders.map(o => ({
        ID: o._id.toString().substring(0, 8) + '...',
        UserID: o.user ? o.user.toString().substring(0, 8) + '...' : '',
        TotalAmount: `LKR ${o.totalAmount}`,
        PaymentStatus: o.paymentStatus,
        OrderStatus: o.orderStatus,
        CreatedAt: new Date(o.createdAt).toLocaleString()
      })));
    } else {
      console.log(`   (No order records yet)`);
    }
    console.log(`\n=============================================================\n`);

    process.exit(0);
  } catch (error) {
    console.error(`❌ Inspection failed: ${error.message}`);
    process.exit(1);
  }
};

inspectDB();
