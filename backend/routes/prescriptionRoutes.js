import * as express from 'express';
import * as authController from '../controllers/authController.js';
import * as prescriptionController from '../controllers/prescriptionController.js';

const router = express.Router();

router.use(authController.protect);

// Doctor creates prescription for an appointment
router.post(
  '/:patient_id',
  authController.restrictTo('doctor'),
  prescriptionController.createPrescription
);

// Get all prescriptions for logged-in user (patient)
router.get(
  '/patient',
  authController.restrictTo('patient'),
  prescriptionController.getPrescriptionsForPatient
);

export default router;
