import db from '../db.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// ================= All MEDICATIONS =================
export const getAllMedications = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 100 } = req.query;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const offset = (pageNum - 1) * limitNum;

  console.log('page', page);
  console.log('limit', limit);

  // ================= TOTAL COUNT =================
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM medications
    WHERE medication_id <> 1;
  `;
  const countResult = await db.query(countQuery);
  const totalRows = parseInt(countResult.rows[0].total, 10);
  const totalPages = Math.ceil(totalRows / limitNum);

  // ================= DATA QUERY =================
  const dataQuery = `
    SELECT
      m.medication_id,
      m.name,
      m.company,
      m.side_effects,
      m.price,
      COALESCE(COUNT(moi.order_id), 0) AS orders_count
    FROM medications m
    LEFT JOIN medicine_order_item moi
      ON moi.medicine_id = m.medication_id
    LEFT JOIN medicine_order mo
      ON mo.order_id = moi.order_id
     AND mo.status = 'completed'
    WHERE m.medication_id <> 1
    GROUP BY m.medication_id
    ORDER BY orders_count DESC
    LIMIT $1 OFFSET $2;
  `;

  const { rows } = await db.query(dataQuery, [limitNum, offset]);

  res.status(200).json({
    status: 'success',
    page: pageNum,
    totalPages,
    results: rows.length,
    totalRows,
    data: rows.map((row) => ({
      medication_id: row.medication_id,
      name: row.name,
      company: row.company,
      side_effects: row.side_effects,
      ordersCount: Number(row.orders_count),
      price: row.price,
    })),
  });
});
// ================= Specific MEDICATIONS ==============================
export const getMedication = catchAsync(async (req, res, next) => {
  const { search } = req.query;
  let whereClauses = [];
  let values = [];
  let idx = 1;
  // ================= SEARCH =================
  if (search === undefined || search === '') {
    whereClauses.push('1 = 0');
  } else {
    whereClauses.push(`name ILIKE $${idx}`);
    values.push(`%${search}%`);
    idx++;
  }

  // ================= QUERY =================
  const q = `
    SELECT *
    FROM medications
    WHERE ${whereClauses.join(' AND ')} AND medication_id <> 1;`;

  const { rows } = await db.query(q, values);

  res.status(200).json({
    status: 'success',
    results: rows.length,
    data: rows,
  });
});
//================== ADD AVAILABLE MEDICATION =================
export const addMedication = catchAsync(async (req, res, next) => {
  const { name, company, side_effects, price } = req.body;

  const q = `
    INSERT INTO medications (name, company, side_effects,price)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const row = (await db.query(q, [name, company, side_effects, price])).rows[0];

  res.status(201).json({
    status: 'success',
    data: row,
  });
});
//================== UPDATE MEDICATION =================
export const updateMedication = catchAsync(async (req, res, next) => {
  const { medicine_id } = req.params;
  let { name, company, side_effects, price } = req.body;
  console.log('id', medicine_id);
  console.log('price', price);

  const oldMed = `SELECT * FROM medications WHERE medication_id = $1`;
  const result = (await db.query(oldMed, [medicine_id])).rows[0];
  if (name === undefined) name = result.name;
  if (company === undefined) company = result.company;
  if (side_effects === undefined) side_effects = result.side_effects;

  const q = `
    UPDATE medications
    SET name = $1, company = $2, side_effects = $3, price = $5
    WHERE medication_id = $4
    RETURNING *;
  `;

  const row = (
    await db.query(q, [name, company, side_effects, medicine_id, price])
  ).rows[0];

  if (!row) return next(new AppError('Medication not found', 404));

  res.status(200).json({
    status: 'success',
    data: row,
  });
});
//==================== DELETE AVAILABLE MEDICATION =================
export const deleteMedication = catchAsync(async (req, res, next) => {
  const medicine_id = Number(req.params.medicine_id);
  if (medicine_id === 1) {
    return next(new AppError('you cannot delete this'));
  }

  console.log(medicine_id);

  const q = `
    DELETE FROM medications
    WHERE medication_id = $1
    RETURNING *;
  `;

  const row = (await db.query(q, [medicine_id])).rows[0];

  if (!row) return next(new AppError('medication not found', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
