// frontend/src/components/Profile/NotificationPreferences.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import './NotificationPreferences.css';

const NotificationPreferences = () => {
  const { user, updateUser } = useAuth();
  const [preferences, setPreferences] = useState({
    orderConfirmations: true,
    orderStatusUpdates: true,
    promotions: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && user.emailPreferences) {
      setPreferences({
        orderConfirmations: user.emailPreferences.orderConfirmations ?? true,
        orderStatusUpdates: user.emailPreferences.orderStatusUpdates ?? true,
        promotions: user.emailPreferences.promotions ?? true,
      });
      setLoading(false);
    }
  }, [user]);

  const handleToggle = (preference) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      setMessage('');
      
      const response = await api.patch(`/users/${user._id}/preferences`, {
        emailPreferences: preferences
      });
      
      if (response.data.success) {
        updateUser({
          ...user,
          emailPreferences: preferences
        });
        setMessage('Preferences saved successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      setMessage('Error saving preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading preferences...</div>;
  }

  return (
    <div className="notification-preferences">
      <h2>Email Notification Preferences</h2>
      
      <div className="preferences-container">
        <div className="preference-item">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={preferences.orderConfirmations}
              onChange={() => handleToggle('orderConfirmations')}
            />
            <span className="toggle-slider"></span>
          </label>
          <div className="preference-details">
            <h3>Order Confirmations</h3>
            <p>Receive email confirmations when you place an order</p>
          </div>
        </div>
        
        <div className="preference-item">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={preferences.orderStatusUpdates}
              onChange={() => handleToggle('orderStatusUpdates')}
            />
            <span className="toggle-slider"></span>
          </label>
          <div className="preference-details">
            <h3>Order Status Updates</h3>
            <p>Receive email updates when your order status changes</p>
          </div>
        </div>
        
        <div className="preference-item">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={preferences.promotions}
              onChange={() => handleToggle('promotions')}
            />
            <span className="toggle-slider"></span>
          </label>
          <div className="preference-details">
            <h3>Promotions and Offers</h3>
            <p>Receive emails about special offers and promotions</p>
          </div>
        </div>
      </div>
      
      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
      
      <button 
        className="save-button" 
        onClick={savePreferences}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Preferences'}
      </button>
    </div>
  );
};

export default NotificationPreferences;