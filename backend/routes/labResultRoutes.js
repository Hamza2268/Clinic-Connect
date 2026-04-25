// routes/labResultRoutes.js
import express from 'express';
import {
  getLabResult,
  createLabResult,
  updateLabResult,
  deleteLabResult,
} from '../controllers/labResultController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router({ mergeParams: true });

// All endpoints require authentication
router.use(protect);

// GET result (patient/doctor/tech/admin authorized in controller)
router.get('/:labTestId/result', getLabResult);

router.use(restrictTo('lab_technician'));
// CREATE result (lab technician)
router.post('/:labTestId/result', createLabResult);

// UPDATE result (lab technician)
router.put('/:labTestId/result', updateLabResult);

// DELETE result (lab technician)
router.delete('/:labTestId/result', deleteLabResult);

export default router;
