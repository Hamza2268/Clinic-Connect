// ================================================
//  Notifications Controller
//  Handles all operations related to user notifications:
//   - Count unread notifications
//   - Get all notifications for the logged-in user
//   - Mark a notification as read
//   - Create a notification

import db from '../db.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// ================= GET UNREAD COUNT =================
export const getUnreadCount = catchAsync(async (req, res, next) => {
  const national_id = req.user.national_id;

  if (!national_id) return next(new AppError('User not authenticated', 401));

  const result = await db.query(
    `
    SELECT COUNT(*) AS unread_count
    FROM notifications
    WHERE user_id = $1 AND is_read = FALSE;
    `,
    [national_id]
  );

  res.status(200).json({
    status: 'success',
    unread_count: Number(result.rows[0].unread_count),
  });
});

// ================= GET ALL NOTIFICATIONS =================
export const getNotifications = catchAsync(async (req, res, next) => {
  const national_id = req.user.national_id;

  if (!national_id) return next(new AppError('User not authenticated', 401));

  const result = await db.query(
    `
    SELECT *
    FROM notifications
    WHERE user_id = $1
    ORDER BY is_read ASC, date DESC;
    `,
    [national_id]
  );

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    notifications: result.rows,
  });
});
/*
{
  "status": "success",
  "results": 12,
  "notifications": [
    {
      "notification_id": 1,
      "type": "system",
      "content": "Welcome!",
      "is_read": false,
      "date": "2024-05-11T10:00:00.000Z"
    },
    ...
  ]
}
*/
// ================= MARK AS READ =================
export const markAsRead = catchAsync(async (req, res, next) => {
  const notificationId = req.params.notificationId;

  const result = await db.query(
    `
    UPDATE notifications
    SET is_read = TRUE
    WHERE notification_id = $1
    RETURNING *;
    `,
    [notificationId]
  );

  if (result.rowCount === 0)
    return next(new AppError('Notification not found', 404));

  res.status(200).json({
    status: 'success',
    message: 'Notification marked as read',
  });
});

// // ================= CREATE NOTIFICATION =================
// // for testing only

// export const createNotification = catchAsync(async (req, res, next) => {
//   const national_id = req.user.national_id;
//   const { type, content } = req.body;

//   if (!type || !content)
//     return next(new AppError('Type and content are required', 400));

//   const result = await db.query(
//     `
//     INSERT INTO notifications (user_id, type, content)
//     VALUES ($1, $2, $3)
//     RETURNING *;
//     `,
//     [national_id, type, content]
//   );

//   res.status(201).json({
//     status: 'success',
//     notification: result.rows[0],
//   });
// });
// /*
// {
//   "status": "success",
//   "notification": {
//     "notification_id": 10,
//     "user_id": 123,
//     "content": "Your appointment is tomorrow",
//     "type": "appointment",
//     "is_read": false,
//     "date": "2024-05-11T14:22:00.000Z"
//   }
// }
// */
