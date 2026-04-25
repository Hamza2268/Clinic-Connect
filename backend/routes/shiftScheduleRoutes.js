import express from 'express';
import {
  getSchedule,
  setSchedule,
  editSchedule,
  deleteSchedule,
} from '../controllers/shiftScheduleController.js';

import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

// All schedule routes require authentication
router.use(protect);

// GET schedule
router.get('/', getSchedule);

// SET schedule for a weekday (create or overwrite)
router.post('/', restrictTo('doctor'), setSchedule);

// EDIT schedule for specific weekday
router.patch('/:weekday', restrictTo('doctor'), editSchedule);

// DELETE schedule for specific weekday
router.delete('/:weekday', restrictTo('doctor'), deleteSchedule);

export default router;
