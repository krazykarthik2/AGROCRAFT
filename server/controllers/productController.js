const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('farmer', 'farmName');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('farmer', 'farmName');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Farmer
const createProduct = async (req, res) => {
  const { name, description, price, category, quantity, imageUrl } = req.body;

  try {
    if (!req.user.farmer) {
      return res.status(400).json({ message: 'Farmer profile not found' });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      quantity,
      imageUrl,
      farmer: req.user.farmer._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Farmer
const updateProduct = async (req, res) => {
  const { name, description, price, category, quantity, imageUrl } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (req.user.role !== 'admin' && String(product.farmer) !== String(req.user.farmer?._id)) {
        return res.status(401).json({ message: 'Not authorized to edit this product' });
      }

      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.quantity = quantity !== undefined ? quantity : product.quantity;
      product.imageUrl = imageUrl || product.imageUrl;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Farmer
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (req.user.role !== 'admin' && String(product.farmer) !== String(req.user.farmer?._id)) {
        return res.status(401).json({ message: 'Not authorized to delete this product' });
      }

      await product.deleteOne();
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
