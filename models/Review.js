const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  text: { type: String },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  // Add any other fields you need for reviews
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;