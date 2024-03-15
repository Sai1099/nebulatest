const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Set up MongoDB connection
mongoose.connect('mongodb+srv://sai:nebula123@cluster0.l9c5xyp.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for storing products
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  pictureUrl: String,
});

// Create a model for the schema
const Product = mongoose.model('Product', productSchema);

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store uploaded images in 'public/uploads'
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const multerUpload = multer({ storage });

// Create an Express app
const app = express();

// Set up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Set up a route for uploading products
app.post('/upload', multerUpload.single('image'), async (req, res) => {
    try {
      const { name, description, price } = req.body;
  
      // Generate a unique filename (optional)
      const filename = req.file ? req.file.filename : null;
  
      const product = new Product({
        name,
        description,
        price,
        pictureUrl: filename ? `/uploads/${filename}` : null, // Update pictureUrl with the correct path
      });
  
      await product.save();
  
      res.status(201).json({ message: 'Product created successfully!', product });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Error creating product' });
    }
  });

// Set up a route for fetching products
app.get('/products', async (req, res) => {
  try {
    console.log('GET /products received');
    const products = await Product.find(); // Fetch all products from the database using Mongoose
    res.json(products); // Send the products array as JSON response
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' }); // Send an error response if something goes wrong
  }
});

// Set up a route for displaying a particular image
app.get('/images/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.render('image', { product });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Error fetching product' });
    }
  });

// Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});