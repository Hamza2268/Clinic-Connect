import express from 'express';
import {
  getUnreadCount,
  getNotifications,
  markAsRead,
  //createNotification,
} from '../controllers/notificationController.js';

import { protect } from '../controllers/authController.js';

const router = express.Router();

// All notification routes require authentication
router.use(protect);

// Routes
router.get('/unread-count', getUnreadCount);
router.get('/', getNotifications);
router.patch('/:notificationId/read', markAsRead);
// router.post('/', createNotification); // for testing only

export default router;
