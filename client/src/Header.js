import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from './essentials/logo.png'; // Correct image path based on your project structure

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="SwasthVerify Logo" className="logo-image" /> {/* Added class for styling */}
        SwasthVerify
      </div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About Project</Link>
      </nav>
    </header>
  );
};

export default Header;
