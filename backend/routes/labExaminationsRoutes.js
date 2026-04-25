import express from 'express';
import * as labExaminationsController from '../controllers/labExaminationsController.js';

import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router.use(protect);
// Public
router.get('/', labExaminationsController.getAllExaminations);
router.get('/Examination', labExaminationsController.getExamination);

// Admin only
router.post('/', restrictTo('admin'), labExaminationsController.addExamination);
router.patch(
  '/:test_id',
  restrictTo('admin'),
  labExaminationsController.updateExamination
);
router.delete(
  '/:test_id',
  restrictTo('admin'),
  labExaminationsController.deleteExamination
);

export default router;
