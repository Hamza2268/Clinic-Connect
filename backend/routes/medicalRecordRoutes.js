import express from 'express';
import {
  getMedicalRecords,
  createMedicalRecord,
  editMedicalRecord,
  deleteMedicalRecord,
} from '../controllers/medicalRecordController.js';

import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router.use(protect);

router.get('/:patientId', getMedicalRecords); // doctor or patient
router.post('/:patient_id', restrictTo('doctor'), createMedicalRecord); // doctor only
router.patch('/:recordId', restrictTo('doctor'), editMedicalRecord); // doctor only
router.delete('/:recordId', restrictTo('doctor'), deleteMedicalRecord); // doctor only

export default router;
