import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import ImageTextExtractor from './ImageTextExtractor';
import AboutProject from './AboutProject';
import Footer from './footer';
import './App.css';

const App = () => {
  const [extractedText, setExtractedText] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [image, setImage] = useState(null); // For uploaded image preview
  const [harmfulChemicals, setHarmfulChemicals] = useState(0); // Harmful chemicals count

  // Handle form submission
const handleSubmit = async () => {
  const words = extractedText.split(/\s+/).filter(word => word.trim().length > 0); // Split text into words

  try {
    const response = await axios.post(
      'https://swasthverify.onrender.com/search-ingredients',
      { ingredients: words }, // Payload
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.count > 0) {
      setHarmfulChemicals(response.data.count);
      setResponseMessage(`Found harmful chemicals: ${response.data.harmfulChemicals.join(', ')}`);
    } else {
      setHarmfulChemicals(0);
      setResponseMessage('No harmful chemicals found.');
    }
  } catch (error) {
    console.error('Error checking chemicals:', error);
    setResponseMessage('Error checking harmful chemicals.');
  }
};


  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="logo">SwasthVerify</div>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About Project</Link>
          </nav>
        </header>

        <Routes>
          {/* Home page */}
          <Route
            path="/"
            element={
              <div className="home">
                <h1>Chemical Checker</h1>

                {/* Image upload section */}
                <div className="upload-section">
                  <h2>Upload Image</h2>
                  <ImageTextExtractor setExtractedText={setExtractedText} setImage={setImage} />
                  {image && <img src={image} alt="Uploaded" className="preview-image" />}
                </div>

                {/* Text extracted section */}
                <div className="text-section">
                  <h2>Edit Extracted Text</h2>
                  <textarea
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    rows="10"
                    cols="50"
                  />
                </div>

                {/* Submit button */}
                <button onClick={handleSubmit} className="submit-button">
                  Submit for Chemical Check
                </button>

                {/* Response message */}
                {responseMessage && (
                  <p className={harmfulChemicals > 0 ? 'error-message' : 'success-message'}>
                    {responseMessage}
                  </p>
                )}

                {/* Show the harmful chemicals count */}
                {harmfulChemicals > 0 && (
                  <p className="harmful-count">Total harmful chemicals found: {harmfulChemicals}</p>
                )}
              </div>
            }
          />

          {/* About Project page */}
          <Route path="/about" element={<AboutProject />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
