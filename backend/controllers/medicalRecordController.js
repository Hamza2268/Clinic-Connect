import db from '../db.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { pushNotification } from '../utils/notify.js';

// ================= GET MEDICAL RECORDS =================
export const getMedicalRecords = catchAsync(async (req, res, next) => {
  const role = req.user.role;
  const userID = req.user.national_id;
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const offset = (page - 1) * limit;

  let patientId;

  // Patient can only get his own records
  if (role === 'patient') {
    patientId = userID;
  }
  // Doctor getting a patient's records
  else if (role === 'doctor') {
    patientId = req.params.patientId;
    if (!patientId)
      return next(new AppError('patientId is required for doctors', 400));
  } else {
    return next(new AppError('Not authorized to view medical records', 403));
  }

  let q;
  if (role === 'doctor') {
    q = `
      SELECT *
      FROM Medical_Records
      WHERE patient_id = $1 AND doctor_id = $4
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3;`;
  } else {
    q = `
      SELECT m.*, d.name
      FROM Medical_Records m
	    left join users d on d.national_id = doctor_id 
      WHERE patient_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3;
    `;
  }

  const result =
    role === 'doctor'
      ? await db.query(q, [patientId, limit, offset, userID])
      : await db.query(q, [patientId, limit, offset]);
  res.status(200).json({
    status: 'success',
    results: result.rowCount,
    data: result.rows,
  });
});

// ================= CREATE MEDICAL RECORD =================
export const createMedicalRecord = catchAsync(async (req, res, next) => {
  const doctorId = req.user.national_id;
  const { patient_id } = req.params;
  const { diagnose, treatment_plan } = req.body;

  if (!patient_id || !diagnose) {
    return next(new AppError('patient_id and diagnose are required', 400));
  }

  // Get doctor's name for notification
  const doctorRow = await db.query(
    `SELECT name FROM users WHERE national_id = $1`,
    [doctorId]
  );
  const doctorName = doctorRow.rows[0]?.name || 'Your doctor';

  const q = `
    INSERT INTO Medical_Records (doctor_id, patient_id, diagnose, treatment_plan)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const result = (
    await db.query(q, [doctorId, patient_id, diagnose, treatment_plan || null])
  ).rows[0];

  // 🔔
  await pushNotification({
    national_id: patient_id,
    type: 'appointment',
    content: `A new medical record has been added by Dr. ${doctorName}.`,
  });

  res.status(201).json({
    status: 'success',
    data: result,
  });
});

// ================= EDIT MEDICAL RECORD =================
export const editMedicalRecord = catchAsync(async (req, res, next) => {
  const doctorId = req.user.national_id;
  const recordId = req.params.recordId;
  const { diagnose, treatment_plan } = req.body;

  if (!diagnose && !treatment_plan) {
    return next(new AppError('Provide at least one field to update', 400));
  }

  const check = await db.query(
    `SELECT record_id, doctor_id, patient_id, diagnose, treatment_plan
     FROM Medical_Records
     WHERE record_id = $1`,
    [recordId]
  );

  if (check.rowCount === 0)
    return next(new AppError('Medical record not found', 404));

  if (check.rows[0].doctor_id !== doctorId) {
    return next(new AppError('You can only edit records you created', 403));
  }

  const old = check.rows[0];
  const newDiagnosis = diagnose || old.diagnose;
  const newPlan = treatment_plan || old.treatment_plan;

  const q = `
    UPDATE Medical_Records
    SET diagnose = $1,
        treatment_plan = $2
    WHERE record_id = $3
    RETURNING *;
  `;

  const result = (await db.query(q, [newDiagnosis, newPlan, recordId])).rows[0];

  // Get doctor's name for notification
  const doctorRow = await db.query(
    `SELECT name FROM users WHERE national_id = $1`,
    [doctorId]
  );
  const doctorName = doctorRow.rows[0]?.name || 'Your doctor';

  // 🔔
  await pushNotification({
    national_id: old.patient_id,
    type: 'appointment',
    content: `Your medical record has been updated by Dr. ${doctorName}.`,
  });

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

// ================= DELETE MEDICAL RECORD =================
export const deleteMedicalRecord = catchAsync(async (req, res, next) => {
  const doctorId = req.user.national_id;
  const recordId = req.params.recordId;

  const check = await db.query(
    `SELECT doctor_id, patient_id FROM medical_records WHERE record_id = $1`,
    [recordId]
  );

  if (check.rowCount === 0)
    return next(new AppError('Medical record not found', 404));

  if (check.rows[0].doctor_id !== doctorId) {
    return next(new AppError('You can only delete records you created', 403));
  }

  await db.query(`DELETE FROM Medical_Records WHERE record_id = $1`, [
    recordId,
  ]);

  // Get doctor's name for notification
  const doctorRow = await db.query(
    `SELECT name FROM users WHERE national_id = $1`,
    [doctorId]
  );
  const doctorName = doctorRow.rows[0]?.name || 'Your doctor';

  // 🔔
  await pushNotification({
    national_id: check.rows[0].patient_id,
    type: 'appointment',
    content: `A medical record has been deleted by Dr. ${doctorName}.`,
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
