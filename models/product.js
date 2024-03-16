// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  pictureUrls: [{ type: String }], 
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;