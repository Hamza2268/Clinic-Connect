import express from 'express';
import {
  getMyAvailableMedications,
  addAvailableMedication,
  updateAvailableMedication,
  deleteAvailableMedication,
  getMedication,
} from '../controllers/availableMedicationsController.js';

import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get(
  '/:pharmacist_id',
  restrictTo('patient', 'pharmacist'),
  getMedication
);
// Pharmacist manages their inventory

router.get('/', restrictTo('pharmacist'), getMyAvailableMedications);



router
  .route('/:medicine_id')
  .patch(restrictTo('pharmacist'), updateAvailableMedication)
  .delete(restrictTo('pharmacist'), deleteAvailableMedication)
  .post(restrictTo('pharmacist'), addAvailableMedication);

export default router;
