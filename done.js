const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Set up MongoDB connection
mongoose.connect('mongodb+srv://sai:nebula123@cluster0.l9c5xyp.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for storing image paths
const ImageSchema = new mongoose.Schema({
  path: String,
});

// Create a model for the schema
const Image = mongoose.model('Image', ImageSchema);

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Create an Express app
const app = express();
const ejs = require('ejs');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up a route for uploading images
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // Create a new Image document with the uploaded file path
    const newImage = new Image({ path: req.file.path });
    await newImage.save();
    res.send('Image uploaded successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading image');
  }
});

// Set up a route for displaying all uploaded images
app.get('/images', async (req, res) => {
  try {
    // Find all Image documents in the database
    const images = await Image.find();
    res.render('images', { images });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving images');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});