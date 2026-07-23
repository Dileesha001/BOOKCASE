const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const { protect } = require('../middleware/auth');
const { logSystemEvent } = require('../middleware/logger');

/**
 * @route   POST /api/orders
 * @desc    Create a new order & update book inventory stock
 */
router.post('/', protect, async (req, res) => {
  try {
    const { items, paymentMethod, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Verify stock and calculate total
    for (const item of items) {
      const book = await Inventory.findById(item.bookId);
      if (!book) {
        return res.status(404).json({ success: false, message: `Book not found: ${item.bookId}` });
      }

      if (book.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for '${book.title}'. Available: ${book.quantity}`
        });
      }

      const itemTotal = book.priceLKR * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        book: book._id,
        title: book.title,
        price: book.priceLKR,
        quantity: item.quantity
      });

      // Deduct stock in MongoDB
      book.quantity -= item.quantity;
      if (book.quantity === 0) {
        book.stockStatus = 'Out of Stock';
      }
      await book.save();
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      totalAmount,
      paymentMethod,
      shippingAddress
    });

    await logSystemEvent({
      level: 'audit',
      action: 'ORDER_CREATED',
      message: `Order #${order._id} created by user '${req.user.username}' for LKR ${totalAmount}`,
      userId: req.user._id,
      meta: { orderId: order._id, totalAmount }
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/orders/myorders
 * @desc    Get logged in user orders
 */
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
