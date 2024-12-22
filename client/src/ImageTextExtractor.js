import React, { useState } from 'react';
import axios from 'axios';
import './App.css';  // Import the CSS file

const ImageTextExtractor = ({ setExtractedText, setImage }) => {
  const [imageFile, setImageFile] = useState(null);

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file)); // Set the image preview
    }
  };

  // Handle text extraction from image
  const handleExtractText = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setExtractedText(response.data.text);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      {/* Image Upload Input */}
      <input type="file" onChange={handleImageUpload} />

      {/* Extract Text Button */}
      {imageFile && (
        <button onClick={handleExtractText} className="extract-button">
          Extract Text
        </button>
      )}
    </div>
  );
};

export default ImageTextExtractor;
