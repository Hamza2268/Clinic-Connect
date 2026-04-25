import * as authController from './../controllers/authController.js';
import express from 'express';
import * as labtestController from './../controllers/labtestController.js';
const router = express.Router();

router.use(authController.protect);

router.get(
  '/labtests',
  authController.restrictTo('patient', 'doctor', 'lab_technician'),
  labtestController.getLabtests
);

router.get(
  '/required',
  authController.restrictTo('patient'),
  labtestController.getRequiredLabTestsForPatient
);

router.post(
  '/labtests/:user_id',
  authController.restrictTo('doctor', 'patient'),
  labtestController.createLabtest
);
router.patch(
  '/assign/:labtechnician_id',
  authController.restrictTo('patient'),
  labtestController.assignLabTestToTechnician
);

router.patch(
  '/labtests/:labtest_id',
  authController.restrictTo('patient', 'lab_technician'),
  labtestController.updateLabTest
);

export default router;
