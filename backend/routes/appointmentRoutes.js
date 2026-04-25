import * as express from 'express';
import * as authController from '../controllers/authController.js';
import * as appointmentController from '../controllers/appointmentController.js';

const router = express.Router();

router.use(authController.protect);

// Patient creates appointment
router.post('/:national_id', appointmentController.createAppointment);

// Update status (cancel / complete)
router.patch(
  '/:appointmentID/status',
  authController.restrictTo('patient', 'doctor'),
  appointmentController.updateAppointmentStatus
);

// get appointments
router.get(
  '/get_appointments',
  authController.protect,
  appointmentController.getAppointments
);

export default router;
