const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const User = require('../server/models/User');
const Inventory = require('../server/models/Inventory');
const Log = require('../server/models/Log');

const seedData = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookcase_db';
    console.log(`📡 Connecting to MongoDB at: ${connStr}...`);
    await mongoose.connect(connStr);

    console.log('🧹 Cleaning existing test collections...');
    await User.deleteMany({});
    await Inventory.deleteMany({});
    await Log.deleteMany({});

    console.log('👤 Seeding default users (Admin & Customer)...');
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@bookcase.lk',
      password: 'adminpassword123',
      role: 'admin',
      profile: {
        fullName: 'Bookcase Sanctuary Administrator',
        phone: '+94 77 123 4567',
        address: 'No. 42, Literary Avenue, Colombo 07'
      }
    });

    const customerUser = await User.create({
      username: 'dileesha',
      email: 'dileesha@example.com',
      password: 'customerpassword123',
      role: 'customer',
      profile: {
        fullName: 'Dileesha Ravishan',
        phone: '+94 71 987 6543',
        address: 'Kandy, Sri Lanka'
      }
    });

    console.log('📚 Seeding Book Inventory catalog...');
    const books = await Inventory.create([
      {
        title: 'Mandodari (මන්දෝදරී)',
        author: 'Mohan Raj Madawala',
        category: 'Trending',
        priceLKR: 2850,
        discountPercent: 20,
        stockStatus: 'In Stock',
        quantity: 15,
        rating: 4.9,
        reviewsCount: 142,
        coverImage: 'Images/mandodari.jpg',
        isFeatured: true,
        description: 'Epic historical literary fiction detailing the unsung tales of Queen Mandodari.'
      },
      {
        title: 'Senkottan (සෙන්කොට්ටන්)',
        author: 'Mahinda Prasad Masimbula',
        category: 'Bestsellers',
        priceLKR: 1950,
        discountPercent: 10,
        stockStatus: 'In Stock',
        quantity: 25,
        rating: 4.8,
        reviewsCount: 98,
        coverImage: 'Images/senkottan.jpg',
        isFeatured: true,
        description: 'Captivating narrative capturing the rich rural heritage and human resilience.'
      },
      {
        title: 'Advanced Mathematics for Grade 12 & 13',
        author: 'Prof. K. A. Perera',
        category: 'Education',
        priceLKR: 3200,
        discountPercent: 0,
        stockStatus: 'In Stock',
        quantity: 40,
        rating: 4.7,
        reviewsCount: 65,
        coverImage: 'Images/math.jpg',
        description: 'Comprehensive study reference guide for Sri Lanka G.C.E. Advanced Level students.'
      },
      {
        title: 'The Silent Patient',
        author: 'Alex Michaelides',
        category: 'Novels',
        priceLKR: 2400,
        discountPercent: 15,
        stockStatus: 'In Stock',
        quantity: 12,
        rating: 4.6,
        reviewsCount: 210,
        coverImage: 'Images/silent-patient.jpg',
        description: 'A shocking psychological thriller of a woman’s act of violence against her husband.'
      },
      {
        title: 'Out of Stock Classic Collection',
        author: 'Various Authors',
        category: 'Translations',
        priceLKR: 1500,
        discountPercent: 0,
        stockStatus: 'Out of Stock',
        quantity: 0,
        rating: 4.5,
        reviewsCount: 30,
        coverImage: 'Images/classic-out.jpg',
        description: 'Rare translated classics currently awaiting reprint.'
      }
    ]);

    console.log('📝 Seeding initial Logging details into MongoDB...');
    await Log.create([
      {
        level: 'info',
        action: 'SYSTEM_BOOT',
        message: 'Bookcase database schema initialization complete.',
        meta: { nodeVersion: process.version, environment: 'development' }
      },
      {
        level: 'audit',
        action: 'SEED_DATABASE',
        message: 'Seeded default admin user, customer account, and inventory books.',
        user: adminUser._id
      },
      {
        level: 'security',
        action: 'TTL_INDEX_CREATED',
        message: 'MongoDB Log TTL auto-expiration set to 30 days retention.'
      }
    ]);

    console.log('✅ MongoDB Database Seeding Complete!');
    console.log('--------------------------------------------------');
    console.log(`👤 Admin User: admin@bookcase.lk | Password: adminpassword123`);
    console.log(`👤 Customer: dileesha@example.com | Password: customerpassword123`);
    console.log(`📚 Inserted ${books.length} inventory items into 'inventories' collection.`);
    console.log(`📝 Inserted initial logs into 'logs' collection.`);
    console.log('--------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
