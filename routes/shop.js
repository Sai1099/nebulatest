// routes/shop.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');
const getCurrentUser = require('../middleware/getCurrentUser');
 // Receive the app object as an argument

  // Define the route handler for GET /products
  router.get('/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.render('shop', { products });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
//i want the review part that contains a image placeholder to place the product images by customer????
 
// Assuming you have a route handler for rendering the product details page
router.get('/products/:productId',getCurrentUser, async (req, res) => {
  try {
    const productId = req.params.productId;
    // Retrieve the product details and user information as needed
    const product = await Product.findById(productId);
    const user = req.currentUser; // Assuming user information is stored in req.currentUser

    res.render('product-details', { product, user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to display products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('shop', { products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Route to submit a review
router.post('/products/:productId/reviews', async (req, res) => {
  try {
    const { productId } = req.params;
    const { text } = req.body;

    const review = new Review({
      productId,
      text
    });
    await review.save();

    // Add the review to the product's reviews array
    await Product.findByIdAndUpdate(productId, { $push: { reviews: review._id } });

    res.redirect(`/products/${productId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Middleware to check authentication
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
