import db from '../db.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { pushNotification } from '../utils/notify.js';
// ================= GET LABTESTS FOR PATIENT + STATUS COUNTS =================
export const getLabtests = catchAsync(async (req, res) => {
  const userId = req.user.national_id;
  const role = req.user.role;
  const { page = 1, limit = 10, status } = req.query;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const offset = (pageNum - 1) * limitNum;

  let whereClause = '';
  const params = [];
  let idx = 1;

  // ================= ROLE-BASED FILTER =================
  if (role === 'patient') {
    whereClause = `l.patient_id = $${idx}`;
    params.push(userId);
    idx++;
  }

  if (role === 'doctor') {
    whereClause = `l.doctor_id = $${idx}`;
    params.push(userId);
    idx++;
  }

  if (role === 'lab_technician') {
    whereClause = `l.labtechnician_id = $${idx}`;
    params.push(userId);
    idx++;
  }

  // ================= STATUS FILTER =================
  if (status && status.trim() !== '') {
    whereClause += ` AND l.status = $${idx}`;
    params.push(status.trim());
    idx++;
  }

  // ================= TOTAL COUNT =================
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM lab_test l
    WHERE ${whereClause}
  `;
  const countResult = await db.query(countQuery, params);
  const total = Number(countResult.rows[0].total);
  const totalRows = Number(countResult.rows[0].total);
  const totalPages = Math.ceil(totalRows / limit);
  // ================= PAGINATED DATA =================
  const dataQuery = `
  SELECT
    l.labtest_id,
    l.patient_id,
    p.name AS patient_name,
    l.doctor_id,
    l.labtechnician_id,
    l.test_type,
    l.status,
    l.date,
    d.name AS doctor_name,
    s.result,
    s.pickup_date,
    lbe.test_name,
    lbe.reference_range
  FROM lab_test l
  LEFT JOIN users d ON d.national_id = l.doctor_id
  LEFT JOIN users p ON p.national_id = l.patient_id
  LEFT JOIN lab_results s ON s.labtest_id = l.labtest_id
  LEFT JOIN labexaminations lbe ON l.test_type = lbe.test_id
  WHERE ${whereClause}
  ORDER BY l.date DESC
  LIMIT $${idx} OFFSET $${idx + 1}
`;

  params.push(limitNum, offset);
  const labtests = (await db.query(dataQuery, params)).rows;

  res.status(200).json({
    status: 'success',
    total,
    totalPages,
    data: labtests,
  });
});


export const getRequiredLabTestsForPatient = catchAsync(
  async (req, res, next) => {
    const patientId = req.user.national_id;
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const offset = (page - 1) * limit;

    // get data
    const labTestsQuery = `
      SELECT *
      FROM lab_test
      WHERE patient_id = $1
        AND status = 'requested'
      ORDER BY date DESC
      LIMIT $2 OFFSET $3;
    `;

    const countQuery = `
      SELECT COUNT(*) 
      FROM lab_test
      WHERE patient_id = $1
        AND status = 'requested';
    `;

    const labTests = await db.query(labTestsQuery, [patientId, limit, offset]);

    const totalCount = await db.query(countQuery, [patientId]);

    res.status(200).json({
      status: 'success',
      results: labTests.rows.length,
      total: Number(totalCount.rows[0].count),
      totalPages: Math.ceil(totalCount.rows[0].count / limit),
      currentPage: page,
      data: labTests.rows,
    });
  }
);


// ================= CREATE LABTEST =================
export const createLabtest = catchAsync(async (req, res, next) => {
  let patient_id, doctor_id, labtechnician_id, status;
  const { test_id } = req.body;
  if (req.user.role === 'patient') {
    patient_id = req.user.national_id;
    labtechnician_id = req.params.user_id;
    status = 'assigned';
  } else {
    doctor_id = req.user.national_id;
    patient_id = req.params.user_id;
    status = 'requested';
  }

  const result = await db.query(
    `CALL create_labtest($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [
      req.user.role,
      patient_id,
      doctor_id,
      labtechnician_id,
      test_id,
      status,
      null,
      null,
      null,
    ]
  );

  const createdLabTest = result.rows[0];

  res.status(200).json({
    status: 'success',
    data: createdLabTest,
  });
});
// ================= UPDATE LABTEST STATUS =================
export const updateLabTest = catchAsync(async (req, res, next) => {
  const { role, national_id: user_id } = req.user;
  const { status } = req.body;
  const { labtest_id } = req.params;

  let q;

  if (role === 'patient' && status === 'cancelled') {
    q = `
      UPDATE lab_test
      SET status = $1
      WHERE labtest_id = $2 AND patient_id = $3
      RETURNING *
    `;
  } else if (
    role === 'lab_technician' &&
    (status === 'cancelled' || status === 'completed')
  ) {
    q = `
      UPDATE lab_test
      SET status = $1
      WHERE labtest_id = $2 AND labtechnician_id = $3
      RETURNING *
    `;
  } else {
    return res.status(403).json({
      status: 'fail',
      message: 'You are not allowed to update this status',
    });
  }

  const { rows } = await db.query(q, [status, labtest_id, user_id]);

  if (rows.length === 0) {
    return res.status(404).json({
      status: 'fail',
      message: 'Lab test not found or not authorized',
    });
  }

  res.status(200).json({
    status: 'success',
    data: rows[0],
  });
});

export const assignLabTestToTechnician = catchAsync(async (req, res, next) => {
  const { labTestId } = req.body;
  const { labtechnician_id } = req.params;

  if (!labtechnician_id) {
    return next(new AppError('labtechnician_id is required', 400));
  }

  const query = `
      UPDATE lab_test
      SET labtechnician_id = $1,
          status = 'assigned'
      WHERE labtest_id = $2
        AND status = 'requested'
      RETURNING *;
    `;

  const result = await db.query(query, [labtechnician_id, labTestId]);

  if (result.rows.length === 0) {
    return next(new AppError('Lab test not found or already assigned', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Lab test assigned successfully',
    data: result.rows[0],
  });
});
