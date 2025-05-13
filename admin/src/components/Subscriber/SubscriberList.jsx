import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Subscriber.css';

const SubscribersList = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/subscribers');
      setSubscribers(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      setError('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedSubscribers(subscribers.map(sub => sub._id));
    } else {
      setSelectedSubscribers([]);
    }
  };

  const handleSelectSubscriber = (subscriberId) => {
    if (selectedSubscribers.includes(subscriberId)) {
      setSelectedSubscribers(selectedSubscribers.filter(id => id !== subscriberId));
    } else {
      setSelectedSubscribers([...selectedSubscribers, subscriberId]);
    }
  };

  const handleDelete = async (subscriberId) => {
    if (!window.confirm('Are you sure you want to delete this subscriber?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:4000/api/subscribers/${subscriberId}`);
      // Refresh the list
      fetchSubscribers();
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      setError('Failed to delete subscriber');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSubscribers.length === 0) {
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedSubscribers.length} subscribers?`)) {
      return;
    }

    try {
      // In a real app, you'd implement a bulk delete endpoint
      // For this demo, we'll delete them one by one
      await Promise.all(
        selectedSubscribers.map(id => axios.delete(`http://localhost:5000/api/subscribers/${id}`))
      );
      
      // Refresh the list and clear selection
      fetchSubscribers();
      setSelectedSubscribers([]);
    } catch (error) {
      console.error('Error deleting subscribers:', error);
      setError('Failed to delete some subscribers');
    }
  };

  if (loading) {
    return <div className="subscribers-loading">Loading subscribers...</div>;
  }

  return (
    <div className="subscribers-container">
      <h2>Subscribers List</h2>
      
      {error && <div className="subscribers-error">{error}</div>}
      
      <div className="subscribers-actions">
        <button 
          className="bulk-delete-button"
          disabled={selectedSubscribers.length === 0}
          onClick={handleBulkDelete}
        >
          Delete Selected ({selectedSubscribers.length})
        </button>
        <button className="refresh-button" onClick={fetchSubscribers}>
          Refresh List
        </button>
      </div>
      
      {subscribers.length === 0 ? (
        <div className="no-subscribers">No subscribers found</div>
      ) : (
        <div className="subscribers-table-container">
          <table className="subscribers-table">
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={selectedSubscribers.length === subscribers.length && subscribers.length > 0}
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Subscribed On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map(subscriber => (
                <tr key={subscriber._id}>
                  <td>
                    <input 
                      type="checkbox"
                      checked={selectedSubscribers.includes(subscriber._id)}
                      onChange={() => handleSelectSubscriber(subscriber._id)}
                    />
                  </td>
                  <td>{subscriber.name}</td>
                  <td>{subscriber.email}</td>
                  <td>{new Date(subscriber.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete(subscriber._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {selectedSubscribers.length > 0 && (
        <div className="send-email-action">
          <Link 
            to="/send-email" 
            state={{ selectedSubscribers }} 
            className="send-email-button"
          >
            Send Email to Selected ({selectedSubscribers.length})
          </Link>
        </div>
      )}
    </div>
  );
};

export default SubscribersList;