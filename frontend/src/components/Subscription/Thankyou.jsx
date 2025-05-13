import React from 'react';
import { Link } from 'react-router-dom';
import './ThankYou.css';

const ThankYou = () => {
  return (
    <div className="thank-you-container">
      <div className="thank-you-content">
        <h2>Thank You for Subscribing!</h2>
        <p>Your subscription has been confirmed. You'll start receiving updates soon.</p>
        <Link to="/" className="back-button">Back to Home</Link>
      </div>
    </div>
  );
};