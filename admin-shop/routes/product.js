const express = require('express');
const multer = require('multer');
const Product = require('../models/product');
const path = require('path');
const router = express.Router();
const fs = require('fs');
// Configure Multer for image uploads
const upload = multer({ dest: 'public/uploads/' }); // Store uploaded images in 'public/images'

router.get('/dash/products', async (req, res) => {
  try {
    console.log('GET /dash/products received');
    const products = await Product.find(); // Fetch all products from the database using Mongoose
    res.json(products); // Send the products array as JSON response
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' }); // Send an error response if something goes wrong
  }
});
router.get('/dash/products/add', (req, res) => {
  res.render('add_product', { product: {} });// Assuming you have a view file named add_product.ejs
});
router.post('/dash/products', upload.single('picture'), async (req, res) => {
  try {
    const { name, description, price } = req.body;

    // Generate a unique filename (optional)
    const filename = req.file ? req.file.filename : null;

    // Read the contents of the uploaded file
    const pictureData = req.file
      ? fs.readFileSync(path.join('public/uploads', req.file.filename))
      : null;

    const product = new Product({
      name,
      description,
      price,
      pictureUrl: filename ? `/uploads/${filename}` : null, // Adjust path based on your setup
      //pictureData: pictureData ? pictureData.toString('base64') : null // Store picture data as Base64 string
    });

    await product.save();

    res.status(201).json({ message: 'Product created successfully!', product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
});

module.exports = router;