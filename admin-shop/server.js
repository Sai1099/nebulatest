const express = require('express');
const mongoose = require('mongoose');
const productRouter = require('./routes/product');
const dotenv = require('dotenv');
const Product = require('./models/product');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port or default to 3000

app.set('view engine', 'ejs'); // Assuming you're using EJS as the template engine
app.set('views', path.join(__dirname, 'views'));
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(express.json()); // Parse incoming JSON data
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory

// Routes
app.use('/dash/products', productRouter);
app.get('/dash/products', productRouter);
app.get('/dash/products/add',productRouter);
app.post('/dash/products',productRouter);
// Define a GET route for "/api/products"
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    // Fetch all products from the database using Mongoose
    res.json(products); // Send the products array as JSON response
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' }); // Send an error response if something goes wrong
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => console.log(`Server listening on port ${port}`));