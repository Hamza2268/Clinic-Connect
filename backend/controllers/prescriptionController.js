import db from '../db.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
//================== CREATE PRESCRIPTION BY DOCTOR =================
export const createPrescription = catchAsync(async (req, res, next) => {
  const doctor_id = req.user?.national_id;
  const { patient_id } = req.params;
  const { medicines, expired_date } = req.body;

  await db.query('BEGIN');

  // Create perscription
  const prescriptionResult = await db.query(
    `
    INSERT INTO prescription (patient_id, doctor_id, expired_date)
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
    [patient_id, doctor_id, expired_date],
  );

  const prescription = prescriptionResult.rows[0];
  const prescription_id = prescription.prescription_id;
  // Insert items
  for (const item of medicines) {
    const { medicine_id, dose, note } = item;

    await db.query(
      `
      INSERT INTO prescription_medications (prescription_id, medicine_id, dose, note)
      VALUES ($1, $2, $3, $4);
      `,
      [prescription_id, medicine_id, dose, note],
    );
  }

  const itemsResult = await db.query(
    `
    SELECT 
      medication_id,
      name,
      dose,
      note
    FROM prescription_medications
    JOIN medications ON medication_id = medicine_id
    WHERE prescription_id = $1;
    `,
    [prescription_id],
  );

  await db.query('COMMIT');

  res.status(201).json({
    status: 'success',
    data: {
      prescription,
      items: itemsResult.rows,
    },
  });
});

//================== GET PRESCRIPTIONS FOR PATIENT =================
export const getPrescriptionsForPatient = catchAsync(async (req, res, next) => {
  const patient_id = req.user.national_id;
  const { page = 1, limit = 10 } = req.query;

  const offset = (page - 1) * limit;

  // ================= TOTAL COUNT =================
  const countQuery = `
    SELECT 
      COUNT(*) AS total_prescriptions,
      COUNT(*) FILTER (WHERE expired_date < CURRENT_DATE AND expired_date IS NOT NULL) AS expired_prescriptions
    FROM prescription
    WHERE patient_id = $1
  `;
  const countResult = await db.query(countQuery, [patient_id]);
  const { total_prescriptions, expired_prescriptions } = countResult.rows[0];

  const totalPages = Math.ceil(total_prescriptions / limit);

  // ================= PRESCRIPTIONS + MEDICATIONS =================
  const dataQuery = `
    SELECT
      p.prescription_id,
      d.name AS doctor_name,
      d.img,
      p.date,
      p.expired_date,
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'medicine_id', m.medication_id,
          'name', m.name,
          'dose', pm.dose,
          'note', pm.note
        )
      ) FILTER (WHERE m.medication_id IS NOT NULL) AS medications
    FROM prescription p
    JOIN users d ON d.national_id = p.doctor_id
    LEFT JOIN prescription_medications pm ON pm.prescription_id = p.prescription_id
    LEFT JOIN medications m ON m.medication_id = pm.medicine_id
    WHERE p.patient_id = $1
    GROUP BY p.prescription_id, d.name, d.img, p.date, p.expired_date
    ORDER BY p.date DESC
    LIMIT $2 OFFSET $3
  `;

  const { rows } = await db.query(dataQuery, [patient_id, limit, offset]);

  res.status(200).json({
    status: 'success',
    page: Number(page),
    totalPages,
    total_prescriptions: Number(total_prescriptions),
    expired_prescriptions: Number(expired_prescriptions),
    results: rows.length,
    data: rows,
  });
});
