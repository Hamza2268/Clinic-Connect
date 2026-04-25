import db from '../db.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { pushNotification } from '../utils/notify.js';

// ================= ADD REVIEW (only patient) =================
export const addReview = catchAsync(async (req, res, next) => {
  const reviewer_id = req.user.national_id;
  const { target_id } = req.params;
  const { rating, feedback } = req.body;

  const review = await db.query(
    `
    INSERT INTO reviews (reviewer_id, target_id, target_role, rating, feedback)
    VALUES ($1,$2,'doctor',$3,$4)
    RETURNING *;
    `,
    [reviewer_id, target_id, rating, feedback]
  );

  // 🔔
  await pushNotification({
    national_id: target_id,
    type: 'system',
    content: 'You have received a new review from a patient.',
  });

  res.status(201).json({
    status: 'success',
    review: review.rows[0],
  });
});

// ================= GET REVIEWS (ANYONE) =================
export const getReviewsForTarget = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const reviews = await db.query(
    `SELECT * FROM reviews WHERE target_id = $1 ORDER BY date DESC`,
    [id]
  );

  res.status(200).json({
    status: 'success',
    results: reviews.rows.length,
    reviews: reviews.rows,
  });
});

// ================= DELETE REVIEW (reviewer or admin) =================
export const deleteReview = catchAsync(async (req, res, next) => {
  const reviewId = req.params.id;
  const userId = req.user.national_id;
  const role = req.user.role;

  const review = await db.query(`SELECT * FROM reviews WHERE review_id = $1`, [
    reviewId,
  ]);

  if (!review.rows.length) return next(new AppError('Review not found', 404));
  if (review.rows[0].reviewer_id !== userId && role !== 'admin')
    return next(new AppError('Not authorized', 403));

  await db.query(`DELETE FROM reviews WHERE review_id = $1`, [reviewId]);

  res.status(204).json({ status: 'success' });
});
