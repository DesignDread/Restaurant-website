
// src/components/SendEmail.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Subscriber.css';

const SendEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedSubscribers = location.state?.selectedSubscribers || [];
  
  const [emailData, setEmailData] = useState({
    subject: '',
    content: '',
    subscriberIds: selectedSubscribers,
    sendToAll: selectedSubscribers.length === 0
  });
  
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    // If subscribers are selected, fetch their details
    const fetchSelectedSubscribers = async () => {
      if (selectedSubscribers.length > 0) {
        try {
          setLoading(true);
          const response = await axios.get('http://localhost:4000/api/subscribers');
          const allSubscribers = response.data;
          
          // Filter only selected subscribers
          const filtered = allSubscribers.filter(sub => 
            selectedSubscribers.includes(sub._id)
          );
          
          setSubscribers(filtered);
        } catch (error) {
          console.error('Error fetching subscribers:', error);
          setError('Failed to load subscriber details');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchSelectedSubscribers();
  }, [selectedSubscribers]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailData({
      ...emailData,
      [name]: value
    });
  };
  
  const handleSendToAllChange = (e) => {
    setEmailData({
      ...emailData,
      sendToAll: e.target.checked,
      subscriberIds: e.target.checked ? [] : selectedSubscribers
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the form
    if (!emailData.subject.trim()) {
      setError('Subject is required');
      return;
    }
    
    if (!emailData.content.trim()) {
      setError('Email content is required');
      return;
    }
    
    setError('');
    setSuccess('');
    setSending(true);
    
    try {
      const endpoint = emailData.sendToAll || emailData.subscriberIds.length > 1 
        ? 'http://localhost:4000/api/emails/bulk'
        : 'http://localhost:4000/api/emails/single';
      
      const payload = {
        subject: emailData.subject,
        content: emailData.content,
        subscriberIds: emailData.sendToAll ? [] : emailData.subscriberIds
      };
      
      // If sending to a single subscriber
      if (!emailData.sendToAll && emailData.subscriberIds.length === 1) {
        payload.subscriberId = emailData.subscriberIds[0];
      }
      
      const response = await axios.post(endpoint, payload);
      
      setSuccess(`Email sent successfully to ${emailData.sendToAll ? 'all subscribers' : 
        response.data.recipientCount ? `${response.data.recipientCount} subscribers` : '1 subscriber'}`);
      
      // Reset form after successful send
      setEmailData({
        subject: '',
        content: '',
        subscriberIds: [],
        sendToAll: true
      });
      
    } catch (error) {
      console.error('Error sending email:', error);
      setError('Failed to send email. Please try again.');
    } finally {
      setSending(false);
    }
  };
  
  if (loading) {
    return <div className="send-email-loading">Loading subscriber information...</div>;
  }
  
  return (
    <div className="send-email-container">
      <h2>Send Email Updates</h2>
      
      {error && <div className="send-email-error">{error}</div>}
      {success && <div className="send-email-success">{success}</div>}
      
      <form onSubmit={handleSubmit} className="send-email-form">
        <div className="form-group">
          <label>Recipients</label>
          
          {selectedSubscribers.length > 0 ? (
            <div className="selected-recipients">
              <p>
                <strong>{subscribers.length} subscribers selected:</strong>
              </p>
              <ul className="recipients-list">
                {subscribers.map(sub => (
                  <li key={sub._id}>{sub.name} ({sub.email})</li>
                ))}
              </ul>
              
              <div className="send-to-all-option">
                <label>
                  <input
                    type="checkbox"
                    checked={emailData.sendToAll}
                    onChange={handleSendToAllChange}
                  />
                  Send to all subscribers instead
                </label>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <p>No subscribers selected. Email will be sent to all subscribers.</p>
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={emailData.subject}
            onChange={handleChange}
            placeholder="Enter email subject"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Email Content</label>
          <textarea
            id="content"
            name="content"
            value={emailData.content}
            onChange={handleChange}
            placeholder="Write your email content here... HTML is supported"
            rows="10"
            required
          ></textarea>
          <p className="form-hint">You can use HTML tags for formatting</p>
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/subscribers')}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="send-button"
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendEmail;