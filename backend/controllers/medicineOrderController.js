import db from '../db.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { pushNotification } from '../utils/notify.js';

// ================= CREATE MEDICINE ORDER =================
export const createMedicineOrder = catchAsync(async (req, res, next) => {
  const patientId = req.user?.national_id;
  const { pharmacist_id } = req.params;
  const { medicines } = req.body;

  if (!Array.isArray(medicines) || medicines.length === 0) {
    return next(new AppError('Medicines list is required', 400));
  }

  await db.query('BEGIN');

  // Create order
  const orderResult = await db.query(
    `
    INSERT INTO medicine_order (patient_id, pharmacist_id, status)
    VALUES ($1, $2, 'requested')
    RETURNING *;
    `,
    [patientId, pharmacist_id],
  );

  const order = orderResult.rows[0];
  const orderId = order.order_id;

  // Insert items
  for (const item of medicines) {
    const { medicine_id, quantity } = item;

    await db.query(
      `
      INSERT INTO medicine_order_item (order_id, medicine_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (order_id, medicine_id)
      DO UPDATE SET quantity = medicine_order_item.quantity + EXCLUDED.quantity;
      `,
      [orderId, medicine_id, quantity],
    );
  }

  const itemsResult = await db.query(
    `
    SELECT
      m.medication_id,
      m.name,
      moi.quantity
    FROM medicine_order_item moi
    JOIN medications m ON m.medication_id = moi.medicine_id
    WHERE moi.order_id = $1;
    `,
    [orderId],
  );

  await db.query('COMMIT');

  // 🔔
  await pushNotification({
    national_id: pharmacist_id,
    type: 'pharmacy',
    content: 'You have received a new medicine order.',
  });

  res.status(201).json({
    status: 'success',
    data: {
      order,
      items: itemsResult.rows,
    },
  });
});

export const createMedicineOrderByPrescription = catchAsync(
  async (req, res, next) => {
    console.log('DONE');
    const patientId = req.user.national_id;
    const { pharmacist_id } = req.params;
    const { prescription_id } = req.body;
    console.log(patientId, pharmacist_id, prescription_id);

    if (!prescription_id) {
      return next(new AppError('prescription_id is required', 400));
    }

    // ================= CHECK PRESCRIPTION =================
    const prescriptionQuery = `
      SELECT *
      FROM prescription
      WHERE prescription_id = $1
        AND patient_id = $2;
    `;

    const prescriptionResult = await db.query(prescriptionQuery, [
      prescription_id,
      patientId,
    ]);

    if (prescriptionResult.rows.length === 0) {
      return next(new AppError('Prescription not found or not active', 404));
    }

    // ================= GET PRESCRIPTION MEDICINES =================
    const medsQuery = `
      SELECT
        pm.medicine_id
      FROM prescription_medications pm
      WHERE pm.prescription_id = $1;
    `;

    const medsResult = await db.query(medsQuery, [prescription_id]);

    if (medsResult.rows.length === 0) {
      return next(
        new AppError('No medicines found for this prescription', 400),
      );
    }

    // ================= CREATE ORDER =================
    const orderQuery = `
      INSERT INTO medicine_order
        (patient_id, pharmacist_id, status)
      VALUES
        ($1, $2, 'requested')
      RETURNING *;
    `;

    const orderResult = await db.query(orderQuery, [patientId, pharmacist_id]);

    const orderId = orderResult.rows[0].order_id;

    // ================= INSERT ORDER ITEMS =================
    const insertItemsQuery = `
      INSERT INTO medicine_order_item
        (order_id, medicine_id, quantity)
      VALUES
        ($1, $2, 1);
    `;

    for (const med of medsResult.rows) {
      await db.query(insertItemsQuery, [orderId, med.medicine_id]);
    }

    res.status(201).json({
      status: 'success',
      message: 'Prescription order created successfully',
      data: {
        order_id: orderId,
      },
    });
  },
);

//================== GET MEDICINE ORDERS FOR USER (PATIENT / PHARMACIST) ==============
export const getMedicineOrders = catchAsync(async (req, res, next) => {
  const user_id = req.user.national_id;
  const { page = 1, limit = 10, status } = req.query;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const offset = (pageNum - 1) * limitNum;

  // ================= TOTAL COUNT =================
  let countQuery = `
    SELECT COUNT(DISTINCT order_id) AS total
    FROM medicine_order
    WHERE (patient_id = $1 OR pharmacist_id = $1)
  `;
  const countParams = [user_id];

  if (status) {
    countQuery += ` AND status = $2`;
    countParams.push(status);
  }

  const countResult = await db.query(countQuery, countParams);
  const totalRows = Number(countResult.rows[0].total);
  const totalPages = Math.ceil(totalRows / limitNum);

  // ================= STATUS COUNTS (ALL STATUSES) =================
  const statusCountsQuery = `
    SELECT
      COUNT(*) FILTER (WHERE status = 'requested') AS requested,
      COUNT(*) FILTER (WHERE status = 'ready_for_pickup') AS ready_for_pickup,
      COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled,
      COUNT(*) FILTER (WHERE status = 'completed') AS completed
    FROM medicine_order
    WHERE (patient_id = $1 OR pharmacist_id = $1)
  `;

  const statusCountsResult = await db.query(statusCountsQuery, [user_id]);
  const statusCounts = statusCountsResult.rows[0];

  // ================= ORDERS + TOTAL PRICE =================
  let dataQuery = `
    SELECT
      mo.order_id,
      mo.order_date,
      mo.pickup_date,
      mo.status,
      mo.patient_id,
      mo.pharmacist_id,
      p.pharmacy_name,
      u.address,
      -- return only patient name from users table
      up.name AS patient_name,
      COALESCE(
        SUM(moi.quantity * m.price),
        0
      ) AS total_price,
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'medicine_id', m.medication_id,
          'name', m.name,
          'quantity', moi.quantity,
          'price', m.price
        )
      ) FILTER (WHERE m.medication_id IS NOT NULL) AS items
    FROM medicine_order mo
    LEFT JOIN medicine_order_item moi
      ON mo.order_id = moi.order_id
    LEFT JOIN medications m
      ON m.medication_id = moi.medicine_id
    LEFT JOIN pharmacist p
      ON p.pharmacist_id = mo.pharmacist_id
    LEFT JOIN users u
      ON mo.pharmacist_id = u.national_id
    LEFT JOIN users up
      ON mo.patient_id = up.national_id
    WHERE (mo.patient_id = $1 OR mo.pharmacist_id = $1)
  `;

  const dataParams = [user_id];

  if (status) {
    dataQuery += ` AND mo.status = $2`;
    dataParams.push(status);
  }

  dataQuery += `
   GROUP BY
      mo.order_id,
      mo.order_date,
      mo.pickup_date,
      mo.status,
      mo.patient_id,
      mo.pharmacist_id,
      p.pharmacy_name,
      u.address,
      up.name
    ORDER BY mo.order_date DESC
    LIMIT $${dataParams.length + 1}
    OFFSET $${dataParams.length + 2}
  `;

  dataParams.push(limitNum, offset);

  const { rows } = await db.query(dataQuery, dataParams);

  res.status(200).json({
    status: 'success',
    page: pageNum,
    totalPages,
    results: rows.length,
    totalRows,
    counts: {
      requested: Number(statusCounts.requested),
      ready_for_pickup: Number(statusCounts.ready_for_pickup),
      cancelled: Number(statusCounts.cancelled),
      completed: Number(statusCounts.completed),
    },
    data: rows,
  });
});
// ============== GET MEDICINE ORDERS FOR A PATIENT (PHARMACIST VIEW) ==============
export const getPatientMedicineOrders = catchAsync(async (req, res, next) => {
  const pharmacist_id = req.user.national_id;
  const patient_id = req.params.patient_id; // patient selected by pharmacist when clicking the card
  const { page = 1, limit = 10 } = req.query;

  const offset = (page - 1) * limit;

  // ================= TOTAL COUNT =================
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM medicine_order
    WHERE patient_id = $1
      AND pharmacist_id = $2
  `;
  const countParams = [patient_id, pharmacist_id];

  const countResult = await db.query(countQuery, countParams);
  const totalRows = Number(countResult.rows[0].total);
  const totalPages = Math.ceil(totalRows / limit);

  // ================= ORDERS + ITEMS =================
  const dataQuery = `
    SELECT
      mo.order_id,
      mo.order_date,
      mo.status,
      mo.patient_id,
      mo.pharmacist_id,
      m.medication_id,
      m.name AS medicine_name,
      moi.quantity
    FROM medicine_order mo
    LEFT JOIN medicine_order_item moi
      ON mo.order_id = moi.order_id
    LEFT JOIN medications m
      ON m.medication_id = moi.medicine_id
    WHERE mo.patient_id = $1
      AND mo.pharmacist_id = $2
    ORDER BY mo.order_date DESC
    LIMIT $3 OFFSET $4
  `;
  const dataParams = [patient_id, pharmacist_id, limit, offset];

  const { rows } = await db.query(dataQuery, dataParams);

  // ================= GROUPING =================
  const ordersMap = {};

  rows.forEach((row) => {
    if (!ordersMap[row.order_id]) {
      ordersMap[row.order_id] = {
        order_id: row.order_id,
        patient_id: row.patient_id,
        pharmacist_id: row.pharmacist_id,
        status: row.status,
        date: row.order_date,
        items: [],
      };
    }

    if (row.medication_id) {
      ordersMap[row.order_id].items.push({
        medicine_id: row.medication_id,
        name: row.medicine_name,
        quantity: row.quantity,
      });
    }
  });

  const orders = Object.values(ordersMap);

  // ================= RESPONSE =================
  res.status(200).json({
    status: 'success',
    page: Number(page),
    totalPages,
    results: orders.length,
    totalRows,
    data: orders,
  });
});
// ================= UPDATE ORDER STATUS =================
export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const role = req.user.role;
  const { orderId } = req.params;
  const { status } = req.body;

  const allowedStatuses = ['ready_for_pickup', 'cancelled', 'completed'];
  if (!allowedStatuses.includes(status)) {
    return next(new AppError('Invalid order status', 400));
  }

  let result;

  // PATIENT: CANCEL ONLY
  if (role === 'patient') {
    if (status !== 'cancelled') {
      return next(
        new AppError('Patients can only cancel medicine orders', 403),
      );
    }

    result = await db.query(
      `
      DELETE FROM medicine_order
      WHERE order_id = $1
        AND patient_id = $2
        AND status = 'requested'
      RETURNING *;
      `,
      [orderId, req.user.national_id],
    );
  } else if (role === 'pharmacist') {
    if (status === 'ready_for_pickup' || status === 'completed')
      await updateStatus(status, orderId);

    result = await db.query(
      `
      UPDATE medicine_order
      SET status = $1::medicine_order_status,
          pickup_date = CASE
            WHEN $1::medicine_order_status = 'ready_for_pickup'::medicine_order_status
            THEN CURRENT_TIMESTAMP
            ELSE pickup_date
          END
      WHERE order_id = $2
        AND pharmacist_id = $3
      RETURNING *;
      `,
      [status, orderId, req.user.national_id],
    );
  } else {
    return next(new AppError('Not authorized', 403));
  }

  if (result.rowCount === 0) {
    return next(
      new AppError('Order not found or status change not allowed', 400),
    );
  }

  const order = result.rows[0];
  // 🔔
  if (role === 'pharmacist' && order.patient_id) {
    await pushNotification({
      national_id: order.patient_id,
      type: 'pharmacy',
      content: `Your medicine order is now ${order.status}.`,
    });
  }

  if (role === 'patient' && order.pharmacist_id) {
    await pushNotification({
      national_id: order.pharmacist_id,
      type: 'pharmacy',
      content: `A medicine order was cancelled by the patient.`,
    });
  }

  res.status(200).json({
    status: 'success',
    data: { order },
  });
});

const updateStatus = async (status, orderId) => {
  const checkQuery = `
    SELECT
      CASE
        WHEN EXISTS (
          SELECT 1
          FROM medicine_order_item moi
          LEFT JOIN availablemedications am
            ON moi.medicine_id = am.medicine_id
          WHERE moi.order_id = $1
            AND (am.quantity IS NULL OR am.quantity < moi.quantity)
        )
        THEN false
        ELSE true
      END AS all_available;
  `;
  const checkResult = await db.query(checkQuery, [orderId]);
  const allAvailable = checkResult.rows[0].all_available;

  if (!allAvailable) {
    throw new AppError(
      'Oops! Some medicines in order are not available in the required quantities.',
    );
  }

  if (status === 'completed') {
    const updateQuery = `
     UPDATE availablemedications am
SET quantity = am.quantity - moi.quantity
FROM medicine_order_item moi
WHERE moi.order_id = $1
  AND am.medicine_id = moi.medicine_id
  AND am.quantity >= moi.quantity
RETURNING am.medicine_id, am.quantity;

    `;
    const updatedRows = await db.query(updateQuery, [orderId]);
    console.log('Updated stock:', updatedRows.rows);
  }
};
