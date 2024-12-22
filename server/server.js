const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const Tesseract = require('tesseract.js');
const mongoose = require('mongoose');

// Setup MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define the chemical schema
const chemicalSchema = new mongoose.Schema({
  harmfulChemicals: [String],
  sourceLink: String,
}, { collection: 'chemicals' });

const Chemical = mongoose.model('Chemical', chemicalSchema);

const app = express();

// Setup CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Setup file upload directory
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Unique filename
  }
});
const upload = multer({ storage });

// Endpoint for image upload and text extraction
app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = req.file.path;
  try {
    // Extract text from the image using Tesseract.js
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
      logger: (m) => console.log(m)
    });
    res.json({ text });
  } catch (error) {
    console.error('Error during OCR processing:', error);
    res.status(500).json({ message: 'Error processing the image.' });
  } finally {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });
  }
});

// Endpoint to search for harmful chemicals in the ingredients list
app.post('/api/search-ingredients', async (req, res) => {
  const { ingredients } = req.body;

  try {
    // Fetch harmful chemicals from MongoDB
    const harmfulChemicalsData = await Chemical.findOne({});
    
    if (!harmfulChemicalsData) {
      return res.status(500).json({ message: 'Harmful chemicals data not found in MongoDB' });
    }

    const harmfulChemicals = harmfulChemicalsData.harmfulChemicals || [];
    const foundChemicals = [];

    ingredients.forEach((ingredient) => {
      harmfulChemicals.forEach((chemical) => {
        if (ingredient.toLowerCase() === chemical.toLowerCase()) {
          foundChemicals.push(chemical);
        }
      });
    });

    res.json({
      count: foundChemicals.length,
      harmfulChemicals: foundChemicals,
      sourceLink: harmfulChemicalsData.sourceLink || 'Source link not provided',
    });
  } catch (error) {
    console.error('Error fetching harmful chemicals from MongoDB:', error);
    res.status(500).json({ message: 'Error searching ingredients.' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
