import * as express from 'express';
import * as authController from '../controllers/authController.js';
import { protect } from '../controllers/authController.js';
import * as requestController from './../controllers/RequestsController.js';

const router = express.Router();

// All notification routes require authentication
// router.use(protect);

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.get('/', requestController.getRequests);

export default router;
