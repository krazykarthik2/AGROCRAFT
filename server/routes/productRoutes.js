const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, farmer } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, farmer, createProduct);
router.route('/:id')
  .get(getProductById)
  .put(protect, farmer, updateProduct)
  .delete(protect, farmer, deleteProduct);

module.exports = router;
