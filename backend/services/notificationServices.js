// backend/services/notificationService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Email templates
const emailTemplates = {
  orderConfirmation: (order) => ({
    subject: `Order Confirmation #${order.orderId}`,
    html: `
      <h1>Thank you for your order!</h1>
      <p>Your order #${order.orderId} has been received and is being processed.</p>
      <h2>Order Details:</h2>
      <ul>
        ${order.items.map(item => `<li>${item.quantity} x ${item.name} - $${item.price.toFixed(2)}</li>`).join('')}
      </ul>
      <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
      <p>You can track your order status <a href="${process.env.WEBSITE_URL}/orders/${order.orderId}">here</a>.</p>
    `
  }),
  
  orderStatusUpdate: (order) => ({
    subject: `Order #${order.orderId} Status Update: ${order.status}`,
    html: `
      <h1>Your Order Status Has Been Updated</h1>
      <p>Your order #${order.orderId} is now: <strong>${order.status}</strong></p>
      <p>Estimated delivery time: ${order.estimatedDeliveryTime}</p>
      <p>Track your order <a href="${process.env.WEBSITE_URL}/orders/${order.orderId}">here</a>.</p>
    `
  }),
  
  promotion: (promotion) => ({
    subject: promotion.subject,
    html: `
      <div style="text-align: center;">
        <h1>${promotion.title}</h1>
        <p>${promotion.description}</p>
        ${promotion.imageUrl ? `<img src="${promotion.imageUrl}" alt="${promotion.title}" style="max-width: 600px;">` : ''}
        <p>Valid from ${new Date(promotion.startDate).toLocaleDateString()} to ${new Date(promotion.endDate).toLocaleDateString()}</p>
        ${promotion.couponCode ? `<p>Use code: <strong>${promotion.couponCode}</strong> at checkout</p>` : ''}
        <a href="${process.env.WEBSITE_URL}/promotions/${promotion.id}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Offer</a>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (to, template, data) => {
  try {
    const { subject, html } = emailTemplates[template](data);
    
    const mailOptions = {
      from: `"${process.env.EMAIL_SENDER_NAME}" <${process.env.EMAIL_SENDER}>`,
      to,
      subject,
      html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// In-app notification storage
import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['order', 'promotion', 'system'], required: true },
  referenceId: { type: String },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', NotificationSchema);

// Create in-app notification
const createNotification = async (userId, title, message, type, referenceId = null) => {
  try {
    const notification = new Notification({
      userId,
      title,
      message,
      type,
      referenceId
    });
    
    await notification.save();
    return { success: true, notification };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: error.message };
  }
};

// Get user notifications
const getUserNotifications = async (userId, limit = 10, offset = 0, unreadOnly = false) => {
  try {
    const query = { userId };
    
    if (unreadOnly) {
      query.read = false;
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
      
    const total = await Notification.countDocuments(query);
    
    return { success: true, notifications, total };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { success: false, error: error.message };
  }
};

// Mark notification as read
const markNotificationAsRead = async (notificationId) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
    
    return { success: true, notification };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error: error.message };
  }
};

export {
  sendEmail,
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  Notification
};