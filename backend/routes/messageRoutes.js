import express from 'express';
import * as messageController from '../controllers/messageController.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

// all routes require authentication
router.use(protect);

// send a message
router.post('/:receiver_id', messageController.sendMessage);
// list chats (partners + last message)
router.get('/chats', messageController.getChatList);
// conversation with one user
router.get(
  '/conversations/:withUserId',
  messageController.markConversationAsRead,
  messageController.getConversation
);
// mark single message as read
// router.patch('/:messageId/read', messageController.markMessageAsRead);
// mark whole conversation as read

export default router;
