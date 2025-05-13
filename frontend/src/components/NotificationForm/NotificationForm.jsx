import React, { useState } from 'react';
import axios from 'axios';

const NotificationForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
    notificationType: 'general'
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const { email, subject, message, notificationType } = formData;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };

      const response = await axios.post(
        'http://localhost:4000/api/notifications/send', 
        formData,
        config
      );

      setStatus({ 
        type: 'success', 
        message: 'Notification sent successfully!' 
      });
      
      // Clear form
      setFormData({
        email: '',
        subject: '',
        message: '',
        notificationType: 'general'
      });
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to send notification' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notification-form">
      <h2>Send Notification</h2>
      
      {status.message && (
        <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {status.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Recipient Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="notificationType">Notification Type:</label>
          <select
            id="notificationType"
            name="notificationType"
            value={notificationType}
            onChange={handleChange}
            required
          >
            <option value="general">General</option>
            <option value="order_confirmation">Order Confirmation</option>
            <option value="password_reset">Password Reset</option>
            <option value="account_update">Account Update</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={subject}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={handleChange}
            rows="5"
            required
          ></textarea>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Notification'}
        </button>
      </form>
    </div>
  );
};

export default NotificationForm;