import express from 'express';
import * as medicationsController from '../controllers/medicationsController.js';

import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router.use(protect);

// get medications
router.get('/medication', medicationsController.getMedication);

// Admin only
router.use(restrictTo('admin'));
router
  .route('/')
  .get(medicationsController.getAllMedications)
  .post(medicationsController.addMedication);

router
  .route('/:medicine_id')
  .patch(medicationsController.updateMedication)
  .delete(medicationsController.deleteMedication);

export default router;
