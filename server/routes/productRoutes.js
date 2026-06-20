const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
} = require('../controllers/productController');
const { protect, farmer } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, farmer, createProduct);
router.route('/:id').get(getProductById);

module.exports = router;
