const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  text: { type: String, required: true },
  rating: { type: Number, required: true },
  username: { type: String, required: true }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;