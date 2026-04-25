import db from '../db.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// ================= All Examinations =================
export const getAllExaminations = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, sort = 'test_name', order = 'asc' } = req.query;

  const allowedSortFields = ['test_name'];
  const sortField = allowedSortFields.includes(sort) ? sort : 'name';
  const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
  const offset = (page - 1) * limit;

  // ================= TOTAL COUNT =================
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM labexaminations
    WHERE test_id <> 1;
  `;
  const countResult = await db.query(countQuery);
  const totalRows = parseInt(countResult.rows[0].total, 10);
  const totalPages = Math.ceil(totalRows / limit);

  // ================= PAGINATED QUERY =================
  const dataQuery = `
    SELECT *
    FROM labexaminations
    WHERE test_id <> 1
    ORDER BY ${sortField} ${sortOrder}
    LIMIT $1 OFFSET $2;
  `;
  const values = [limit, offset];

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
// ================= Specific EXAMINATIONS ==============================
export const getExamination = catchAsync(async (req, res, next) => {
  const { search } = req.query;
  let whereClauses = [];
  let values = [];
  let idx = 1;
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
    SELECT *
    FROM labexaminations
    WHERE ${whereClauses.join(' AND ')} AND test_id <> 1;`;

  const { rows } = await db.query(q, values);

  res.status(200).json({
    status: 'success',
    results: rows.length,
    data: rows,
  });
});
//================== ADD AVAILABLE MEDICATION =================
export const addExamination = catchAsync(async (req, res, next) => {
  const { test_name, warnings, preparation_notes, reference_range } = req.body;

  const q = `
    INSERT INTO labexaminations (test_name, warnings, preparation_notes,reference_range)
    VALUES ($1, $2, $3,$4)
    RETURNING *;
  `;

  const row = (
    await db.query(q, [test_name, warnings, preparation_notes, reference_range])
  ).rows[0];

  res.status(201).json({
    status: 'success',
    data: row,
  });
});
//================== UPDATE EXAMINATION =================
export const updateExamination = catchAsync(async (req, res, next) => {
  const { test_id } = req.params;
  let { test_name, warnings, preparation_notes } = req.body;

  const oldMed = `SELECT * FROM labexaminations WHERE test_id = $1`;
  const result = (await db.query(oldMed, [test_id])).rows[0];
  if (test_name === undefined) test_name = result.test_name;
  if (warnings === undefined) warnings = result.warnings;
  if (preparation_notes === undefined)
    preparation_notes = result.preparation_notes;

  const q = `
    UPDATE labexaminations
    SET test_name = $1, warnings = $2, preparation_notes = $3
    WHERE test_id = $4
    RETURNING *;
  `;

  const row = (
    await db.query(q, [test_name, warnings, preparation_notes, test_id])
  ).rows[0];

  if (!row) return next(new AppError('Examination not found', 404));

  res.status(200).json({
    status: 'success',
    data: row,
  });
});
//==================== DELETE AVAILABLE EXAMINATION =================
export const deleteExamination = catchAsync(async (req, res, next) => {
  const test_id = Number(req.params.test_id);
  if (test_id === 1) {
    return next(new AppError('you cannot delete this'));
  }

  const q = `
    DELETE FROM labexaminations
    WHERE test_id = $1
    RETURNING *;
  `;

  const row = (await db.query(q, [test_id])).rows[0];

  if (!row) return next(new AppError('medication not found', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
