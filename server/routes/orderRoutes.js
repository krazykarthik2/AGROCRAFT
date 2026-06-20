const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  updateOrderStatus,
  getOrders,
} = require('../controllers/orderController');
const { protect, farmer, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getOrders);

router.route('/myorders').get(protect, getMyOrders);
router.route('/farmer').get(protect, farmer, getFarmerOrders);
router.route('/:id/status').put(protect, updateOrderStatus);

module.exports = router;
