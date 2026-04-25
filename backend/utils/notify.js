// utils/notify.js
// console.log used for testing and debugging
import db from '../db.js';
import catchAsync from '../utils/catchAsync.js';

export const pushNotification = async ({ national_id, type, content }) => {
  if (!national_id || !type || !content) return;

  // 1. Insert into PostgreSQL
  const result = await db.query(
    `
      INSERT INTO notifications (user_id, type, content)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
    [national_id, type, content]
  );

  const notification = result.rows[0];

  // 2. Emit via Socket.IO (real-time)
  if (global.io) {
    global.io.to(String(national_id)).emit('new_notification', notification);
  }

  return notification;
};
