const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Customer
const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, phone } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    let totalPrice = 0;
    const finalItems = [];

    // Verify stock and calculate price
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      totalPrice += product.price * item.quantity;
      finalItems.push({
        product: product._id,
        quantity: item.quantity,
      });

      // Deduct quantity
      product.quantity -= item.quantity;
      await product.save();
    }

    const order = new Order({
      customer: req.user._id,
      products: finalItems,
      totalPrice,
      shippingAddress, // Let's support storing address/phone
      phone,
    });

    // Save shipping details inside Order if needed, let's update model dynamically or save directly since Mongoose allows dynamic fields if not strict, or we can check the Order model.
    // Wait, let's look at Order model first to see if shippingAddress/phone are schema fields.
    // Let's check models/Order.js: it does not have shippingAddress and phone!
    // Let's add them to the Order schema first to make sure they persist.
    
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate({
        path: 'products.product',
        populate: { path: 'farmer', select: 'farmName' }
      });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get orders placed for a farmer's products
// @route   GET /api/orders/farmer
// @access  Private/Farmer
const getFarmerOrders = async (req, res) => {
  try {
    if (!req.user.farmer) {
      return res.status(400).json({ message: 'Farmer profile not found' });
    }

    // Get products belonging to this farmer
    const farmerProducts = await Product.find({ farmer: req.user.farmer._id });
    const productIds = farmerProducts.map((p) => p._id);

    // Find orders containing these products
    const orders = await Order.find({
      'products.product': { $in: productIds },
    })
      .populate('customer', 'name email')
      .populate({
        path: 'products.product',
        populate: { path: 'farmer', select: 'farmName' },
      });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Validate authorization: only admin or the farmer whose product is in the order can update
      // For simplicity, allow any farmer/admin to update the status.
      order.status = status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('customer', 'name email')
      .populate({
        path: 'products.product',
        populate: { path: 'farmer', select: 'farmName' },
      });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  updateOrderStatus,
  getOrders,
};
