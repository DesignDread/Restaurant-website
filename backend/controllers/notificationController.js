import User from '../models/userModel.js';
import { sendNotificationEmail } from '../services/emailServices.js';

// Send notification to a specific user
export const sendUserNotification = async (req, res) => {
  try {
    const { email, notificationType, subject, message } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email }); // Find user by email
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send custom notification
    await sendNotificationEmail(
      user.email,
      user.name,
      notificationType,
      { 
        subject: subject || 'New Notification',
        message: message || 'You have a new notification'
      }
    );

    res.json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
// Send bulk notifications to multiple users or all users
export const sendBulkNotifications = async (req, res) => {
  try {
    const { emails, notificationType, subject, message } = req.body;

    // Find users by email list
    const users = emails?.length > 0
      ? await User.find({ email: { $in: emails } })  // Find users by email list
      : await User.find();  // Optionally, send to all users if no emails provided

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Send notifications to each user
    const notificationPromises = users.map(({ email, name }) =>
      sendNotificationEmail(
        email,
        name,
        notificationType,
        { 
          subject: subject || 'New Notification',
          message: message || 'You have a new notification'
        }
      )
    );

    // Wait for all notifications to be sent
    await Promise.all(notificationPromises);

    res.json({
      message: `Notifications sent to ${users.length} users successfully`
    });
  } catch (error) {
    console.error('Error sending bulk notifications:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
