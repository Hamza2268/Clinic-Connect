import express from 'express';
import {
  addReview,
  getReviewsForTarget,
  deleteReview,
} from '../controllers/reviewController.js';

import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

// All review routes require authentication
router.use(protect);

// Routes
// Only patients can add reviews
router.post('/:target_id', restrictTo('patient'), addReview);
// Any authenticated user can view reviews
router.get('/:id', getReviewsForTarget);
// Only reviewers or admins can delete reviews
router.delete('/:id', restrictTo('patient'), deleteReview);

export default router;
