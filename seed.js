// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Sample product data
const products = [
  { name: 'Polo T-Shirt', description: 'Description of Polo T-Shirt', price: 29.99 },
  { name: 'Jacket', description: 'Description of Jacket', price: 49.99 },
  { name: 'Round Neck T-Shirt', description: 'Description of Round Neck T-Shirt', price: 19.99 },
  { name: 'Long Sleeves T-Shirt', description: 'Description of Long Sleeves T-Shirt', price: 24.99 },
];

// Function to insert products into the database
async function seedProducts() {
  try {
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert new products
    await Product.insertMany(products);
    console.log('Products seeded successfully.');
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}

// Call the function to seed products
seedProducts();
