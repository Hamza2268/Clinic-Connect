import express from 'express';
import * as authController from '../controllers/authController.js';
import * as medicineOrderController from '../controllers/medicineOrderController.js';

const router = express.Router();
router.use(authController.protect);

// Create medicine order (patient only)
router.post(
  '/:pharmacist_id',
  authController.restrictTo('patient'),
  medicineOrderController.createMedicineOrder
);

// Get orders (patient/pharmacist)
router.get('/', medicineOrderController.getMedicineOrders);

// Update order status (patient cancels / pharmacist updates)
router.patch(
  '/:orderId/status',
  authController.restrictTo('patient', 'pharmacist'),
  medicineOrderController.updateOrderStatus
);

// -> GET /api/patients/:patient_id/orders → orders for a patient for logged-in pharmacist
router.get(
  '/patients/:patient_id/orders',
  authController.restrictTo('pharmacist'),
  medicineOrderController.getPatientMedicineOrders
);

router.post(
  '/prescription/:pharmacist_id',
  authController.restrictTo('patient'),
  medicineOrderController.createMedicineOrderByPrescription
);

export default router;
