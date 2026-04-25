import * as authController from './../controllers/authController.js';
import express from 'express';
import * as userController from './../controllers/usersController.js';
import * as userMiddlewares from '../models/userModel.js';
const router = express.Router();

router.post(
  '/Signup',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userMiddlewares.hashPassword,
  authController.signUp
);

router.post(
  '/Signup/Admin',
  authController.protect,
  authController.restrictTo('admin'),
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  authController.confirmAdmin,
  userMiddlewares.hashPassword,
  authController.signUp
);
router.post('/Login', authController.login);

router.post('/ForgotPassword', authController.forgotPassword);
router.patch('/ResetPassword/:token', authController.resetPassword);

router.use(authController.protect);
router.patch('/UpdateMyPassword', authController.updatePassword);
router.post(
  '/create_user',
  userMiddlewares.hashPassword,
  userController.create_user
);
router.patch('/updateStatus/:user_id', userController.updateStatus);
router.delete('/delete_user/:user_id', userController.deleteUsers);
router.get(
  '/pharmacist/patients',
  authController.protect,
  authController.restrictTo('pharmacist'),
  userController.getPatientsForPharmacist
); // -> GET /api/pharmacist/patients?page=1&limit=10
router.delete('/deleteMyAccount', userController.deleteMyAccount);
router.patch(
  '/updatePersonalInfo',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userMiddlewares.hashPassword,
  userController.updatePersonalInfo
);

router.get(
  '/getAllDoctors',
  authController.restrictTo('patient'),
  userController.getAllDoctors
);

router.get(
  '/getAllPharmacists',
  authController.restrictTo('patient'),
  userController.getAllPharmacists
);

router.get(
  '/getAllLabs',
  authController.restrictTo('patient'),
  userController.getAllLabs
);

router.get(
  '/getDoctorSpeciality',
  authController.restrictTo('patient'),
  userController.getDoctorSpeciality
);

router.get(
  '/getDoctor',
  authController.restrictTo('patient'),
  userController.getDoctor
);

router.get(
  '/getPharmacist',
  authController.restrictTo('patient'),
  userController.getPharmacist
);

router.get(
  '/getlab',
  authController.restrictTo('patient'),
  userController.getLab
);
router.get(
  '/patients',
  authController.protect,
  authController.restrictTo('doctor'),
  userController.getPatientsForDoctor
);
router.get(
  '/patients/:patientId/medical-records',
  authController.protect,
  authController.restrictTo('doctor'),
  userController.getMedicalRecordsForPatient
);
router.get(
  '/patients/:patientId/prescriptions',
  authController.protect,
  authController.restrictTo('doctor'),
  userController.getPrescriptionsForPatient
);
router.get(
  '/patients/:patientId/lab-tests',
  authController.protect,
  authController.restrictTo('doctor'),
  userController.getLabTestsForPatient
);
// ================= ADMIN STATISTICS =================

// Count of patients
router.get(
  '/stats/patients-count',
  authController.restrictTo('admin'),
  userController.getPatientsCount
);
// Count of admins
router.get(
  '/stats/admins-count',
  authController.restrictTo('admin'),
  userController.getAdminsCount
);
// Count of pharmacists
router.get('/stats/pharmacists-count', userController.getPharmacistsCount);
// Count of labs
router.get('/stats/labs-count', userController.getLabsCount);
// Count of doctors
router.get('/stats/doctors-count', userController.getDoctorsCount);

// Count of medications
router.get(
  '/stats/medications-count',
  authController.restrictTo('admin'),
  userController.getMedicationsCount
);

// Total stock of medications
router.get(
  '/stats/medications-stock',
  authController.restrictTo('admin'),
  userController.getMedicationsStockCount
);

// Count of medication companies
router.get(
  '/stats/medication-companies',
  authController.restrictTo('admin'),
  userController.getMedicationCompaniesCount
);

// Count of lab examinations
router.get(
  '/stats/lab-examinations',
  authController.restrictTo('admin'),
  userController.getLabExaminationsCount
);

// Count of appointments + monthly stats
router.get(
  '/stats/appointments',
  authController.restrictTo('admin'),
  userController.getAppointmentsStats
);

// Count of prescriptions
router.get(
  '/stats/prescriptions',
  authController.restrictTo('admin'),
  userController.getPrescriptionsCount
);
// Appointments revenue per month
router.get(
  '/stats/appointments-revenue',
  authController.restrictTo('admin'),
  userController.getAppointmentsRevenuePerMonth
);
// Active doctors today
router.get(
  '/stats/active-doctors-today',
  authController.protect,
  authController.restrictTo('admin'),
  userController.getActiveDoctorsToday
);
// Active admins today
router.get('/stats/active-admins-today', userController.getActiveAdminsToday);
// Get all users
router.get(
  '/users',
  authController.restrictTo('admin'),
  userController.getAllUsers
);
// Get patient profile for pharmacist
router.get(
  '/pharmacist/patients/:patientId',
  authController.protect,
  authController.restrictTo('pharmacist'),
  userController.getPatientProfileForPharmacist
);

// Get profiles for patient
// router.get(
//   '/doctors/:doctorId',
//   authController.protect,
//   authController.restrictTo('patient'),
//   userController.getDoctorProfile
// );

router.get(
  '/lab-technician/patients/:patientId',
  authController.protect,
  authController.restrictTo('lab_technician'),
  userController.getPatientProfileForLabTechnician
);

router.get(
  '/lab-technician/',
  authController.restrictTo('lab_technician'),
  userController.getPatientsForLabTechnician
);

router.get(
  '/lab-technician/patients/:patientId',
  authController.protect,
  authController.restrictTo('lab_technician'),
  userController.getPatientProfileForLabTechnician
);

//Get patient profile for all users
router.get('/patients/:patientId', userController.getPatientDetails);

router.get(
  '/doctors/:doctorId',
  authController.protect,
  authController.restrictTo('patient'),
  userController.getDoctorProfile
);
router.get(
  '/labtechnicians/:labTechnicianId',
  authController.protect,
  authController.restrictTo('patient'),
  userController.getLabTechnicianProfile
);
router.get(
  '/pharmacists/:pharmacistId',
  authController.restrictTo('patient'),
  userController.getPharmacistProfile);
// All Admins
router.get(
  '/Admins',
  authController.protect,
  authController.restrictTo('admin'),
  userController.getAdmins);


export default router;
