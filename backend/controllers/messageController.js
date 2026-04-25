import db from '../db.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { validateMessageInput } from '../utils/messageUtils.js';
import {
  emitMessageEvent,
  emitConversationRead,
} from '../utils/socketEvents.js';

// ================= SOCKET EVENT CONSTANTS =================
const SOCKET_EVENTS = {
  NEW_MESSAGE: 'new_message',
  SENT_MESSAGE: 'sent_message',
  CONVERSATION_READ: 'conversation_read',
};

// ================= SEND MESSAGE =================
export const sendMessage = catchAsync(async (req, res, next) => {
  const sender_id = req.user.national_id;
  const { receiver_id } = req.params;
  const { content } = req.body;

  const errMsg = validateMessageInput({ sender_id, receiver_id, content });

  if (errMsg) return next(new AppError(errMsg, 400));

  const result = await db.query(
    `
        INSERT INTO messages (sender_id, receiver_id, content)
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
    [sender_id, receiver_id, content]
  );

  const message = result.rows[0];

  // Emit real-time events to both sender and receiver rooms
  if (global.io) {
    emitMessageEvent(message, sender_id, receiver_id, SOCKET_EVENTS);
  }

  res.status(201).json({
    status: 'success',
    message,
  });
});

// ================= GET CONVERSATION =================
export const getConversation = catchAsync(async (req, res, next) => {
  const currentUserId = req.user.national_id;
  const recipientId = req.params.withUserId;

  // Validate inputs
  if (currentUserId === recipientId) {
    return next(new AppError('Cannot fetch conversation with yourself', 400));
  }

  if (!recipientId) {
    return next(new AppError('Receiver id is required', 400));
  }

  const result = await db.query(
    `
    SELECT * FROM messages
    WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
    ORDER BY date ASC;
    `,
    [currentUserId, recipientId]
  );

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    messages: result.rows,
  });
});

// ================= GET LIST OF CHATS (SQL Implementation - Optimized) =================
export const getChatList = catchAsync(async (req, res, next) => {
  const userId = req.user.national_id;

  // Return the latest (most recent) message for every chat partner of a user
  const result = await db.query(
    `
    SELECT DISTINCT ON (partner) partner, message_id, sender_id, receiver_id, content, is_read, date
    FROM (
      SELECT
        CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END AS partner,
        *
      FROM messages
      WHERE sender_id = $1 OR receiver_id = $1
      ORDER BY date DESC
    ) recent_messages
    ORDER BY partner, date DESC;
    `,
    [userId]
  );

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    chats: result.rows,
  });
});

// ================= MARK CONVERSATION AS READ =================
export const markConversationAsRead = catchAsync(async (req, res, next) => {
  const userId = req.user.national_id;
  const partnerId = req.params.withUserId;

  await db.query(
    `UPDATE messages
     SET is_read = true
     WHERE sender_id = $1 AND receiver_id = $2 AND is_read = false;`,
    [partnerId, userId]
  );

  // Notify sender of conversation being read
  if (global.io) {
    try {
      emitConversationRead(partnerId, userId, SOCKET_EVENTS);
    } catch (error) {
      console.error('Socket emission error:', error);
    }
  }

  next();
});
