import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SubscriptionForm.css'; // Assuming you have a CSS file for styling

const SubscriptionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate form
      if (!formData.name || !formData.email) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
      
      // Email regex validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }
      
      // Submit to API
      await axios.post('http://localhost:4000/api/subscribers', formData);
      
      // Success - redirect to thank you page
      navigate('/thank-you');
    } catch (error) {
      if (error.response && error.response.data.message === 'Email already subscribed') {
        setError('This email is already subscribed to updates');
      } else {
        setError('Something went wrong. Please try again later.');
      }
      console.error('Error submitting form:', error);
    }
    
    setLoading(false);
  };

  return (
    <div className="subscription-form-container">
      <div className="form-wrapper">
        <h2>Subscribe to Updates</h2>
        <p className="form-description">Stay informed about our latest news and updates. Fill out the form below to subscribe.</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="subscribe-button"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Subscribe Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionForm;
