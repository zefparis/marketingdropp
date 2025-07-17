const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productPhotoUpload,
  getTopProducts,
} = require('../controllers/products');

const Order = require('../models/Order');
const Product = require('../models/Product');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Re-route into other resource routers
router.use('/:productId/orders', require('./orders'));

router
  .route('/')
  .get(
    advancedResults(Product, {
      path: 'user',
      select: 'name email',
    }),
    getProducts
  )
  .post(protect, authorize('admin'), createProduct);

router.route('/top').get(getTopProducts);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

router
  .route('/:id/photo')
  .put(protect, authorize('admin'), productPhotoUpload);

module.exports = router;
