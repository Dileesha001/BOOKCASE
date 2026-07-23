const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const { protect, authorize } = require('../middleware/auth');
const { logSystemEvent } = require('../middleware/logger');

/**
 * @route   GET /api/inventory
 * @desc    Get all books with optional category filtering & stock status
 */
router.get('/', async (req, res) => {
  try {
    const { category, stockStatus, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (stockStatus) query.stockStatus = stockStatus;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    const books = await Inventory.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/inventory
 * @desc    Add a new book to the inventory database
 * @access  Protected (Admin / Staff)
 */
router.post('/', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const book = await Inventory.create(req.body);

    await logSystemEvent({
      level: 'audit',
      action: 'INVENTORY_ADDED',
      message: `Added new book '${book.title}' (${book.category}) to inventory`,
      userId: req.user._id,
      meta: { bookId: book._id, price: book.priceLKR, quantity: book.quantity }
    });

    res.status(201).json({ success: true, data: book });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * @route   PUT /api/inventory/:id/stock
 * @desc    Update stock quantity & availability status
 * @access  Protected (Admin / Staff)
 */
router.put('/:id/stock', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { quantity } = req.body;
    const book = await Inventory.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    book.quantity = quantity;
    book.stockStatus = quantity > 0 ? 'In Stock' : 'Out of Stock';
    await book.save();

    await logSystemEvent({
      level: 'audit',
      action: 'STOCK_UPDATED',
      message: `Updated stock for '${book.title}' to ${quantity} (${book.stockStatus})`,
      userId: req.user._id
    });

    res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
