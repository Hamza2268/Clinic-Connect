import express from 'express';
import userRouter from './routes/userRoutes.js';
import notificationRouter from './routes/notificationRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import labExaminationsRouter from './routes/labExaminationsRoutes.js';
import medicationsRouter from './routes/medicationsRoutes.js';
import availableMedicationsRouter from './routes/availableMedicationsRoutes.js';
import medicineOrderRoutes from './routes/medicineOrderRoutes.js';
import globalErrorHandler from './controllers/errorController.js';
import AppError from './utils/appError.js';
import labResultsRouter from './routes/labResultRoutes.js';
import labTechAvailableTestsRouter from './routes/labTechAvailableTestsRoutes.js';
import shiftScheduleRoutes from './routes/shiftScheduleRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import labtestRoutes from './routes/labtestRoutes.js';
import labResultRoutes from './routes/labResultRoutes.js';
import { pushNotification } from './utils/notify.js';
import medicalRecordRoutes from './routes/medicalRecordRoutes.js';
import RequestsRoutes from './routes/RequestsRoute.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/messages', messageRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/lab-examinations', labExaminationsRouter);
app.use('/api/v1/lab-results', labResultsRouter);
app.use('/api/v1/lab-tech-available', labTechAvailableTestsRouter);
app.use('/api/v1/medications', medicationsRouter);
app.use('/api/v1/available-medications', availableMedicationsRouter);
app.use('/api/v1/medicine-orders', medicineOrderRoutes);
app.use('/api/v1/shift-schedule', shiftScheduleRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/medical_records', medicalRecordRoutes);
app.use('/api/v1/labtests', labtestRoutes);
app.use('/api/v1/labresults', labResultRoutes);
app.use('/api/v1/prescriptions', prescriptionRoutes);
app.use('/api/v1/Requests', RequestsRoutes);
app.use(pushNotification);

// Handle unknown routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

export default app;
