import express from 'express';
import * as labTechAvailableTestsController from '../controllers/labTechAvailableTestsController.js';

import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get(
  '/:labtech_id',
  restrictTo('patient', 'lab_technician'),
  labTechAvailableTestsController.getExamination
);
// lab technician manages their inventory
router.use(restrictTo('lab_technician'));
router.get(
  '/',
  restrictTo('lab_technician'),
  labTechAvailableTestsController.getMyAvailableExaminations
);

router
  .route('/:test_id')
  .patch(
    restrictTo('lab_technician'),
    labTechAvailableTestsController.updateAvailableExamination
  )
  .delete(
    restrictTo('lab_technician'),
    labTechAvailableTestsController.deleteAvailableMedication
  )
  .post(
    restrictTo('lab_technician'),
    labTechAvailableTestsController.addAvailableExaminations
  );

export default router;
