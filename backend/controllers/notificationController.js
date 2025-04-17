// backend/controllers/notificationController.js
import { sendEmail, createNotification, getUserNotifications, markNotificationAsRead } from '../services/notificationService.js';
import User from '../models/User.js';

// Send order confirmation
export const sendOrderConfirmation = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('user');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Send email notification
    const emailResult = await sendEmail(
      order.user.email,
      'orderConfirmation',
      order
    );
    
    // Create in-app notification
    const notificationResult = await createNotification(
      order.user._id,
      'Order Confirmation',
      `Your order #${order.orderId} has been received and is being processed.`,
      'order',
      order._id
    );
    
    return res.status(200).json({
      message: 'Order confirmation sent successfully',
      email: emailResult,
      notification: notificationResult
    });
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    return res.status(500).json({ message: 'Error sending order confirmation', error: error.message });
  }
};

// Send order status update
export const sendOrderStatusUpdate = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const order = await Order.findById(orderId).populate('user');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update order status
    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: Date.now()
    });
    
    await order.save();
    
    // Send email notification
    const emailResult = await sendEmail(
      order.user.email,
      'orderStatusUpdate',
      order
    );
    
    // Create in-app notification
    const notificationResult = await createNotification(
      order.user._id,
      'Order Status Update',
      `Your order #${order.orderId} is now: ${status}`,
      'order',
      order._id
    );
    
    return res.status(200).json({
      message: 'Order status update sent successfully',
      order,
      email: emailResult,
      notification: notificationResult
    });
  } catch (error) {
    console.error('Error sending order status update:', error);
    return res.status(500).json({ message: 'Error sending order status update', error: error.message });
  }
};

// Send promotional email
export const sendPromotionalEmail = async (req, res) => {
  try {
    const { promotionId } = req.params;
    const promotion = await Promotion.findById(promotionId);
    
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    
    // Get subscribed users
    const subscribedUsers = await User.find({ 
      emailPreferences: { promotions: true } 
    });
    
    if (subscribedUsers.length === 0) {
      return res.status(200).json({ message: 'No subscribed users found' });
    }
    
    // Send emails in batches to avoid timeout
    const batchSize = 50;
    let successCount = 0;
    let failureCount = 0;
    
    for (let i = 0; i < subscribedUsers.length; i += batchSize) {
      const batch = subscribedUsers.slice(i, i + batchSize);
      
      const emailPromises = batch.map(user => {
        return sendEmail(user.email, 'promotion', promotion)
          .then(result => {
            if (result.success) {
              successCount++;
              // Create in-app notification
              return createNotification(
                user._id,
                promotion.title,
                promotion.description,
                'promotion',
                promotion._id
              );
            } else {
              failureCount++;
              return null;
            }
          })
          .catch(error => {
            failureCount++;
            console.error('Error sending promotion email:', error);
            return null;
          });
      });
      
      await Promise.all(emailPromises);
    }
    
    return res.status(200).json({
      message: 'Promotional campaign completed',
      totalUsers: subscribedUsers.length,
      successCount,
      failureCount
    });
  } catch (error) {
    console.error('Error sending promotional emails:', error);
    return res.status(500).json({ message: 'Error sending promotional emails', error: error.message });
  }
};

// Get user notifications
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, offset = 0, unreadOnly = false } = req.query;
    
    const result = await getUserNotifications(
      userId,
      parseInt(limit),
      parseInt(offset),
      unreadOnly === 'true'
    );
    
    if (!result.success) {
      return res.status(500).json({ message: 'Error fetching notifications', error: result.error });
    }
    
    return res.status(200).json({
      notifications: result.notifications,
      total: result.total
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const result = await markNotificationAsRead(notificationId);
    
    if (!result.success) {
      return res.status(500).json({ message: 'Error marking notification as read', error: result.error });
    }
    
    return res.status(200).json({
      message: 'Notification marked as read',
      notification: result.notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ message: 'Error marking notification as read', error: error.message });
  }
};