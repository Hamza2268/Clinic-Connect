import db from '../db.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// ================= AVAILABLE MEDICATIONS (Pharmacist) =================
export const getMyAvailableMedications = catchAsync(async (req, res, next) => {
  const pharmacist_id = req.user.national_id;
  const { page = 1, limit = 10, sort = 'name', order = 'asc' } = req.query;

  const allowedSortFields = ['name', 'price'];
  const sortField = allowedSortFields.includes(sort) ? sort : 'name';
  const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
  const offset = (page - 1) * limit;

  // ================= WHERE CLAUSES =================
  let whereClauses = ['pharmacist_id = $1'];
  let values = [pharmacist_id];
  let idx = 2;

  const whereSQL = 'WHERE ' + whereClauses.join(' AND ');

  // ================= TOTAL COUNT =================
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM availablemedications
    ${whereSQL};
  `;
  const countResult = await db.query(countQuery, values);
  const totalRows = parseInt(countResult.rows[0].total, 10);
  const totalPages = Math.ceil(totalRows / limit);

  // ================= PAGINATED QUERY =================
  const dataQuery = `
    SELECT medicine_id, name, quantity, price, side_effects,company
    FROM availablemedications, medications
    ${whereSQL} AND medicine_id = medication_id
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
// ================= Specific MEDICATIONS ==============================
// ================= AVAILABLE MEDICATIONS (Pharmacist) =================
export const getMedication = catchAsync(async (req, res, next) => {
  const pharmacist_id = req.params.pharmacist_id || req.user.national_id;
  const {
    page = 1,
    limit = 1000,
    sort = 'name',
    order = 'asc',
    search,
  } = req.query;

  const allowedSortFields = ['name', 'price'];
  const sortField = allowedSortFields.includes(sort) ? sort : 'name';
  const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
  const offset = (page - 1) * limit;

  // ================= WHERE CLAUSES =================
  let whereClauses = ['a.pharmacist_id = $1'];
  let values = [pharmacist_id];
  let idx = 2;

  // Add search if provided
  if (search && search.trim() !== '') {
    whereClauses.push(`m.name ILIKE $${idx}`);
    values.push(`%${search}%`);
    idx++;
  }

  const whereSQL = 'WHERE ' + whereClauses.join(' AND ');

  // ================= TOTAL COUNT =================
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM availablemedications a
    JOIN medications m ON a.medicine_id = m.medication_id
    ${whereSQL};
  `;
  const countResult = await db.query(countQuery, values);
  const totalRows = parseInt(countResult.rows[0].total, 10);
  const totalPages = Math.ceil(totalRows / limit);

  // ================= PAGINATED QUERY =================
  const dataQuery = `
    SELECT a.medicine_id, m.name, a.quantity, m.price, m.side_effects
    FROM availablemedications a
    JOIN medications m ON a.medicine_id = m.medication_id
    ${whereSQL}
    ORDER BY m.${sortField} ${sortOrder}
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
//================== ADD AVAILABLE MEDICATION =================
export const addAvailableMedication = catchAsync(async (req, res, next) => {
  const pharmacistId = req.user.national_id;
  const { medicine_id } = req.params;
  const { quantity } = req.body;

  if (typeof quantity !== 'number' || quantity < 0)
    return next(new AppError('quantity must be a non-negative number', 400));

  const q = `
    INSERT INTO availablemedications (pharmacist_id, medicine_id, quantity)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const row = (await db.query(q, [pharmacistId, medicine_id, quantity]))
    .rows[0];

  res.status(201).json({
    status: 'success',
    data: row,
  });
});
//================== UPDATE AVAILABLE MEDICATION =================
export const updateAvailableMedication = catchAsync(async (req, res, next) => {
  const pharmacistId = req.user.national_id;
  const { medicine_id } = req.params;
  const { quantity } = req.body;

  if (quantity !== undefined && (typeof quantity !== 'number' || quantity < 0))
    return next(new AppError('quantity must be a non-negative number', 400));

  const q = `
    UPDATE AvailableMedications
    SET quantity = $1
    WHERE pharmacist_id = $2 AND medicine_id = $3
    RETURNING *;
  `;

  const row = (await db.query(q, [quantity, pharmacistId, medicine_id]))
    .rows[0];

  if (!row) return next(new AppError('medication not found', 404));

  res.status(200).json({
    status: 'success',
    data: row,
  });
});
//==================== DELETE AVAILABLE MEDICATION =================
export const deleteAvailableMedication = catchAsync(async (req, res, next) => {
  const pharmacistId = req.user.national_id;
  const { medicine_id } = req.params;

  const q = `
    DELETE FROM AvailableMedications
    WHERE pharmacist_id = $1 AND medicine_id = $2
    RETURNING *;
  `;

  const row = (await db.query(q, [pharmacistId, medicine_id])).rows[0];

  if (!row) return next(new AppError('Record not found', 404));

  res.status(200).json({
    status: 'success',
    data: null,
  });
});
