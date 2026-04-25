import db from '../db.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// ================= AVAILABLE EXAMINATIONS (lab_technician) =================
export const getMyAvailableExaminations = catchAsync(async (req, res, next) => {
  const labtech_id = req.user.national_id;
  const { page = 1, limit = 10, sort = 'test_name', order = 'asc' } = req.query;

  const allowedSortFields = ['test_name', 'fees'];
  const sortField = allowedSortFields.includes(sort) ? sort : 'test_name';
  const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
  const offset = (page - 1) * limit;

  // ================= WHERE CLAUSES =================
  let whereClauses = ['labtech_id = $1'];
  let values = [labtech_id];
  let idx = 2;

  const whereSQL = 'WHERE ' + whereClauses.join(' AND ');

  // ================= TOTAL COUNT =================
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM availableexaminations
    ${whereSQL};
  `;
  const countResult = await db.query(countQuery, values);
  const totalRows = parseInt(countResult.rows[0].total, 10);
  const totalPages = Math.ceil(totalRows / limit);

  // ================= PAGINATED QUERY =================
  const dataQuery = `
    SELECT labexaminations.*, total_count, fees
    FROM availableexaminations, labexaminations
    ${whereSQL} AND availableexaminations.test_id = labexaminations.test_id
    ORDER BY ${sortField} ${sortOrder}
    LIMIT $${idx} OFFSET $${idx + 1};
  `;
  values.push(limit, offset);

  const { rows } = await db.query(dataQuery, values);

  res.status(200).json({
    status: 'success',
    page: Number(page),
    totalPages,
    results: rows.length,
    totalRows,
    data: rows,
  });
});
// ================= Specific EXAMINATION ==============================
export const getExamination = catchAsync(async (req, res, next) => {
  const labtech_id = req.params.labtech_id;

  const { search } = req.query;
  let whereClauses = [];
  let values = [];
  let idx = 1;

  // ================= PHARMACIST FILTER =================
  whereClauses.push(`labtech_id = $${idx}`);
  values.push(labtech_id);
  idx++;

  // ================= SEARCH =================
  if (search === undefined || search === '') {
    whereClauses.push('1 = 0');
  } else {
    whereClauses.push(`test_name ILIKE $${idx}`);
    values.push(`%${search}%`);
    idx++;
  }

  // ================= QUERY =================
  const q = `
    SELECT labexaminations.*, total_count, fees
    FROM labexaminations, availableexaminations
    WHERE ${whereClauses.join(
      ' AND '
    )} AND availableexaminations.test_id = labexaminations.test_id;
  `;

  const { rows } = await db.query(q, values);

  res.status(200).json({
    status: 'success',
    results: rows.length,
    data: rows,
  });
});
//================== ADD AVAILABLE EXAMINATION =================
export const addAvailableExaminations = catchAsync(async (req, res, next) => {
  const labtech_id = req.user.national_id;
  const { test_id } = req.params;
  const { fees, total_count } = req.body;

  if (typeof fees !== 'number' || fees < 0)
    return next(new AppError('fees must be a non-negative number', 400));

  if (typeof total_count !== 'number' || total_count < 0)
    return next(new AppError('total count must be a non-negative number', 400));

  const q = `
    INSERT INTO availableexaminations (labtech_id, test_id, fees, total_count)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const row = (await db.query(q, [labtech_id, test_id, fees, total_count]))
    .rows[0];

  res.status(201).json({
    status: 'success',
    data: row,
  });
});
//================== UPDATE AVAILABLE EXAMINATION =================
export const updateAvailableExamination = catchAsync(async (req, res, next) => {
  const labtech_id = req.user.national_id;
  const { test_id } = req.params;
  let { fees, total_count } = req.body;

  if (fees && (typeof fees !== 'number' || fees < 0))
    return next(new AppError('fees must be a non-negative number', 400));

  if (total_count && (typeof total_count !== 'number' || total_count < 0))
    return next(new AppError('total count must be a non-negative number', 400));

  const oldMed = `SELECT * FROM availableexaminations WHERE test_id = $1`;
  const result = (await db.query(oldMed, [test_id])).rows[0];
  if (!fees) fees = result.fees;
  if (!total_count) total_count = result.total_count;

  const q = `
    UPDATE availableexaminations
    SET fees = $1, total_count = $2
    WHERE labtech_id = $3 AND test_id = $4
    RETURNING *;
  `;

  const row = (await db.query(q, [fees, total_count, labtech_id, test_id]))
    .rows[0];

  if (!row) return next(new AppError('Examination not found', 404));

  res.status(200).json({
    status: 'success',
    data: row,
  });
});
//==================== DELETE AVAILABLE MEDICATION =================
export const deleteAvailableMedication = catchAsync(async (req, res, next) => {
  const labtech_id = req.user.national_id;
  const { test_id } = req.params;

  const q = `
    DELETE FROM availableexaminations
    WHERE labtech_id = $1 AND test_id = $2
    RETURNING *;
  `;

  const row = (await db.query(q, [labtech_id, test_id])).rows[0];

  if (!row) return next(new AppError('Examination not found', 404));

  res.status(200).json({
    status: 'success',
    data: null,
  });
});
