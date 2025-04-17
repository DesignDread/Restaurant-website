// backend/routes/notificationRoutes.js
import express from 'express';
import { 
  sendOrderConfirmation, 
  sendOrderStatusUpdate, 
  sendPromotionalEmail, 
  getNotifications, 
  markAsRead 
} from '../controllers/notificationController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Order notifications
router.post('/orders/:orderId/confirm', verifyToken, sendOrderConfirmation);
router.post('/orders/:orderId/status', verifyToken, sendOrderStatusUpdate);

// Promotional emails
router.post('/promotions/:promotionId/send', verifyToken, isAdmin, sendPromotionalEmail);

// User notifications
router.get('/users/:userId/notifications', verifyToken, getNotifications);
router.patch('/notifications/:notificationId/read', verifyToken, markAsRead);

export default router;