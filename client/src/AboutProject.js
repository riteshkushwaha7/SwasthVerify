import React from "react";
import "./AboutProject.css";

const AboutProject = () => {
  return (
    <div className="about-project">
      <h2>About SwasthVerify</h2>
      <div>
        SwasthVerify is an application designed to scan uploaded images and identify harmful chemicals in the ingredients list using advanced image processing techniques. The app utilizes the Tesseract OCR library to extract text from images, which is then analyzed to detect hazardous chemicals. The results are displayed by highlighting harmful elements in red, along with their count.
</div>
<div>
Technologies Used:
Tesseract OCR: This open-source optical character recognition (OCR) engine is used to extract text from the images uploaded by users. Tesseract is highly accurate in recognizing printed text in various fonts and formats.
React.js: The frontend is built using React.js, allowing for a smooth user experience and interactive elements such as image upload and text editing.
Node.js & Express: The backend, built using Node.js and Express, handles requests from the frontend and interacts with the harmful chemicals database to perform ingredient checks.
MongoDB: The app stores data related to harmful chemicals in a MongoDB database, which is queried to determine whether any of the extracted ingredients are hazardous.
Chemicals Database:
The application references a list of 684 hazardous chemicals sourced from the Dish website, which provides an official PDF document listing chemicals that are considered harmful. You can access the source document here.
</div><div>
Why I Created It:
The idea behind SwasthVerify is to help consumers easily check for harmful chemicals in products they use by simply uploading a photo of the ingredients list. As more and more people become health-conscious, it's crucial to have an easy-to-use tool to identify potentially dangerous substances.

      </div>
    </div>
  );
};

export default AboutProject;
