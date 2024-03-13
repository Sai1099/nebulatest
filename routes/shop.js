// shop.js

const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Review = require('../models/Review');
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library
const verifyToken = require('../middleware/verifyJwt');
const app = express();
// Define the route handler for GET /products
router.get('/products', verifyToken,async (req, res) => {
  try {
    const products = await Product.find();
    res.render('shop', { products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/products/:productId',verifyToken, async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    const user = req.user.username;
    console.log(user);

    // Extract user ID from the decoded token (assuming the verifyJwt middleware has already set `req.user`)
    // If you haven't implemented user ID extraction in verifyJwt.js, uncomment the following line and replace `req.user.userId` with the correct approach.
    // const userId = req.user.userId;

    res.render('product-details', { product, user }); // Pass the user ID (if necessary) to the template
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
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
router.post('/products/:productId/reviews', verifyToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const { text, rating } = req.body;

    console.log('Request Body:', req.body); // Log the request body

    // Get the username from the decoded token (assuming the verifyJwt middleware has already set `req.user`)
    const username = req.user.username;

    if (!text || !rating) {
      // Handle missing fields
      return res.status(400).json({ error: 'Please provide both text and rating for the review.' });
    }

    const review = new Review({
      productId,
      text,
      rating,
      username
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

module.exports = router;
