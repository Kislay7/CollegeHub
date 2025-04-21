const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { upload, cloudinary } = require('../config/cloudinary');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products by user id
router.get('/user/:uid', async (req, res) => {
  try {
    const products = await Product.find({ 'user.uid': req.params.uid }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, price, userName, userEmail, userId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const newProduct = new Product({
      title,
      description,
      category,
      price,
      image: req.file.path,
      cloudinary_id: req.file.filename,
      user: {
        name: userName,
        email: userEmail,
        uid: userId
      }
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new product with direct Cloudinary upload
router.post('/direct-upload', async (req, res) => {
  try {
    const { title, description, category, price, image, cloudinary_id, userName, userEmail, userId } = req.body;
    
    if (!image) {
      return res.status(400).json({ message: 'Please provide an image URL' });
    }

    const newProduct = new Product({
      title,
      description,
      category,
      price,
      image,
      cloudinary_id,
      user: {
        name: userName,
        email: userEmail,
        uid: userId
      }
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a product
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    
    // Find the product
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if new image is uploaded
    let updateData = {
      title,
      description,
      category,
      price
    };
    
    if (req.file) {
      // Delete previous image from cloudinary
      if (product.cloudinary_id) {
        await cloudinary.uploader.destroy(product.cloudinary_id);
      }
      
      // Add new image
      updateData.image = req.file.path;
      updateData.cloudinary_id = req.file.filename;
    }
    
    // Update product
    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a product with direct Cloudinary upload
router.put('/direct-upload/:id', async (req, res) => {
  try {
    const { title, description, category, price, image, cloudinary_id } = req.body;
    
    // Find the product
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Prepare update data
    let updateData = {
      title,
      description,
      category,
      price
    };
    
    // If a new image URL is provided, update it
    if (image) {
      updateData.image = image;
      
      // If a new cloudinary_id is provided and it's different from the current one,
      // we might want to delete the old image from Cloudinary
      if (cloudinary_id && cloudinary_id !== product.cloudinary_id && product.cloudinary_id) {
        try {
          await cloudinary.uploader.destroy(product.cloudinary_id);
        } catch (cloudinaryError) {
          console.error('Error deleting old image from Cloudinary:', cloudinaryError);
          // Continue with the update even if Cloudinary deletion fails
        }
      }
      
      // Update the cloudinary_id if provided
      if (cloudinary_id) {
        updateData.cloudinary_id = cloudinary_id;
      }
    }
    
    // Update product
    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete image from cloudinary
    if (product.cloudinary_id) {
      await cloudinary.uploader.destroy(product.cloudinary_id);
    }
    
    // Delete product from database
    await Product.deleteOne({ _id: req.params.id });
    
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search products
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const products = await Product.find({
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { category: { $regex: searchQuery, $options: 'i' } },
        { price: { $regex: searchQuery, $options: 'i' } },
        { 'user.name': { $regex: searchQuery, $options: 'i' } },
        { 'user.email': { $regex: searchQuery, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 