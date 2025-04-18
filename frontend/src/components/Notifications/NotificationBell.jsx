// frontend/src/components/Notifications/NotificationBell.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import axios from 'axios';
import './NotificationBell.css';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Replace useAuth: grab the user ID from localStorage (or change to your own auth logic)
  const stored = localStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : null;

  // Create an axios instance inline instead of importing `api`
  const api = axios.create({
    baseURL: 'http://localhost:4000/api',
    headers: { 'Content-Type': 'application/json' }
  });

  useEffect(() => {
    if (user && user._id) {
      fetchNotifications();
      const intervalId = setInterval(fetchNotifications, 30000);
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get(`/notifications/users/${user._id}/notifications?limit=5&unreadOnly=false`);
      const list = res.data.notifications || [];
      setNotifications(list);
      setUnreadCount(list.filter(n => !n.read).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await api.patch(`/notifications/${notification._id}/read`);
        setNotifications(notifications.map(n =>
          n._id === notification._id ? { ...n, read: true } : n
        ));
        setUnreadCount(c => Math.max(0, c - 1));
      }
      if (notification.type === 'order') {
        navigate(`/orders/${notification.referenceId}`);
      } else if (notification.type === 'promotion') {
        navigate(`/promotions/${notification.referenceId}`);
      }
      setIsOpen(false);
    } catch (err) {
      console.error('Error handling notification:', err);
    }
  };

//   if (!user) return null; // or a login prompt

  return (
    <div className="notification-bell-container">
      <div className="notification-bell" onClick={() => setIsOpen(o => !o)}>
        <Bell size={24} />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </div>

      {isOpen && (
        <div className="notification-dropdown">
          <h3>Notifications</h3>
          {notifications.length === 0 ? (
            <p className="no-notifications" >No notifications yet</p>
          ) : (
            <>
              <ul className="notification-list">
                {notifications.map(n => (
                  <li
                    key={n._id}
                    className={`notification-item ${!n.read ? 'unread' : ''}`}
                    onClick={() => handleNotificationClick(n)}
                  >
                    <div className="notification-content">
                      <h4>{n.title}</h4>
                      <p>{n.message}</p>
                      <span className="notification-time">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <button className="view-all-button" onClick={() => { navigate('/notifications'); setIsOpen(false); }}>
                View All
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;


