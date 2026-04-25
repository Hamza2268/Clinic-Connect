import db from '../db.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { pushNotification } from '../utils/notify.js';

// ================= GET LAB RESULT =================
export const getLabResult = catchAsync(async (req, res, next) => {
  const userId = req.user.national_id;
  const { page = 1, limit = 10 } = req.query; // pagination params
  const offset = (page - 1) * limit;

  // ================= TOTAL COUNT =================
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM lab_results lr
    JOIN lab_test lt ON lr.labtest_id = lt.lab_result_id
    WHERE lt.patient_id = $1 OR lt.doctor_id = $1 OR lt.labtechnician_id = $1
  `;
  const countResult = await db.query(countQuery, [userId]);
  const total = parseInt(countResult.rows[0].total, 10);

  // ================= PAGINATED RESULTS =================
  const resultsQuery = `
    SELECT lr.result, lr.pickup_date
    FROM lab_results lr
    JOIN lab_test lt ON lr.labtest_id = lt.labtest_id
    WHERE lt.patient_id = $1 OR lt.doctor_id = $1 OR lt.labtechnician_id = $1
    ORDER BY lr.pickup_date DESC
    LIMIT $2 OFFSET $3
  `;
  const results = await db.query(resultsQuery, [userId, limit, offset]);

  res.status(200).json({
    status: 'success',
    total,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    results: results.rows,
  });
});

// ================= CREATE LAB RESULT =================
// lab technician inserts result (url) after test status is 'complete'
export const createLabResult = catchAsync(async (req, res, next) => {
  const labTestId = req.params.labTestId;
  const { result } = req.body;
  // the details of the lab test and the name of the lab that handled it
  const testQ = `
    SELECT
      lt.labtest_id,
      lt.patient_id,
      lt.doctor_id,
      lt.labtechnician_id,
      lt.status,
      lt."date",
      l.lab_name AS lab_name
    FROM lab_test lt
    JOIN lab_technician l ON l.labtechnician_id = lt.labtechnician_id
    WHERE lt.labtest_id = $1;
  `;
  const testRow = (await db.query(testQ, [labTestId])).rows[0];

  await db.query('BEGIN');

  const insertQ = `
    INSERT INTO lab_results (labtest_id, result, pickup_date)
    VALUES ($1, $2, NOW())
    RETURNING *;
  `;
  const inserted = (await db.query(insertQ, [labTestId, result])).rows[0];

  // 🔔
  await pushNotification({
    national_id: testRow.patient_id,
    type: 'lab',
    content: `Your lab result from ${testRow.lab_name} is ready. Please check the results in the app.`,
  });

  await db.query('COMMIT');

  res.status(201).json({
    status: 'success',
    data: inserted,
  });
});
// ================= UPDATE LAB RESULT =================
// Only lab technician assigned to test can replace the image
export const updateLabResult = catchAsync(async (req, res, next) => {
  const { national_id: userID } = req.user;
  const { labTestId } = req.params;
  const { result } = req.body;

  const testQ = `
    SELECT
      lt.labtest_id,
      lt.labtechnician_id,
      lt.status,
      l.lab_name AS lab_name,
      lt.patient_id
    FROM lab_test lt
    JOIN lab_technician l ON l.labtechnician_id = lt.labtechnician_id AND lt.labtechnician_id = $2
    WHERE lt.labtest_id = $1;
  `;

  const testData = (await db.query(testQ, [labTestId, userID])).rows[0];

  if (!testData) {
    return next(
      new AppError(
        'Lab test not found OR You are not assigned to this lab test',
        404
      )
    );
  }

  const updateQ = `
    UPDATE lab_results
    SET result = $1,
        pickup_date = NOW()
    WHERE labtest_id = $2
    RETURNING *;
  `;

  const updatedResult = (await db.query(updateQ, [result, labTestId])).rows[0];

  // 🔔
  await pushNotification({
    national_id: testData.patient_id,
    type: 'lab',
    content: `Your lab result from ${testData.lab_name} is now available. Please check the app.`,
  });

  res.status(200).json({
    status: 'success',
    data: updatedResult,
  });
});
// ================= DELETE LAB RESULT =================
// Only lab technician (assigned) can delete result
export const deleteLabResult = catchAsync(async (req, res, next) => {
  const { national_id: userID } = req.user;
  const { labTestId } = req.params;

  const testQ = `
    SELECT
      lt.labtest_id,
      lt.labtechnician_id,
      lt.patient_id,
      l.lab_name AS lab_name
    FROM lab_test lt
    JOIN lab_technician l ON l.labtechnician_id = lt.labtechnician_id
    WHERE lt.labtest_id = $1;
  `;

  const testData = (await db.query(testQ, [labTestId])).rows[0];

  if (!testData) {
    return next(new AppError('Lab test not found', 404));
  }

  if (testData.labtechnician_id !== userID) {
    return next(new AppError('You are not assigned to this lab test', 403));
  }

  const deleted = (
    await db.query(
      `DELETE FROM lab_results WHERE labtest_id = $1 RETURNING *;`,
      [labTestId]
    )
  ).rows[0];

  // 🔔
  await pushNotification({
    national_id: testData.patient_id,
    type: 'lab',
    content: `Your lab result from ${testData.lab_name} has been removed. Please contact the lab if needed.`,
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
