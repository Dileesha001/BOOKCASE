const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Trending',
      'Bestsellers',
      'Education',
      'Novels',
      'Translations',
      'Short Stories',
      'Sci-Fi',
      'Fiction',
      'Poetry'
    ],
    index: true
  },
  priceLKR: {
    type: Number,
    required: [true, 'Price in LKR is required'],
    min: [0, 'Price cannot be negative']
  },
  discountPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  stockStatus: {
    type: String,
    enum: ['In Stock', 'Out of Stock'],
    default: 'In Stock'
  },
  quantity: {
    type: Number,
    required: true,
    default: 10,
    min: 0
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  coverImage: {
    type: String,
    default: 'Images/book-placeholder.jpg'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Inventory', inventorySchema);
