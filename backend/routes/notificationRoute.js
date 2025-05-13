// routes/notificationRoutes.js
import express from 'express';
import { sendUserNotification, sendBulkNotifications } from '../controllers/notificationController.js';


const notificationRoute = express.Router();

// Route to send a notification to a specific user
notificationRoute.post('/send',  sendUserNotification);

// Route to send notifications to multiple users or all users
notificationRoute.post('/bulk',  sendBulkNotifications);

export default notificationRoute;