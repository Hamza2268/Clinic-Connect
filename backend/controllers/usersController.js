import db from './../db.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

import multer from 'multer';
import sharp from 'sharp';
import cloudinary from '../utils/cloudinary.js';
import streamifier from 'streamifier';

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single('photo');

export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}.jpeg`;

  const processedImage = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer();

  const uploadFromBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'users' },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        },
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });
  };

  const result = await uploadFromBuffer(processedImage);
  req.file.cloudinaryUrl = result.secure_url;

  next();
});

//============== ADMIN CREATES USER ==============
export const create_user = catchAsync(async (req, res, next) => {
  const admin_id = req.user.national_id;

  const {
    name,
    birth_date,
    email,
    phone,
    password,
    address,
    license,
    specialization,
    appointment_fees,
    years_of_experience,
    blood_type,
    emergencyContacts,
    opening_time,
    closing_time,
    lab_name,
  } = req.body;

  const role = req.body.role.toLowerCase();
  const gender =
    req.body.gender.charAt(0).toUpperCase() +
    req.body.gender.slice(1).toLowerCase();

  // 1) Connect to DB
  await db.query('BEGIN'); // start transaction

  // 2) Call stored procedure
  await db.query(
    `CALL create_user($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
    [
      name,
      gender,
      birth_date,
      email,
      phone,
      password,
      role,
      address,
      admin_id,
      license,
      specialization,
      appointment_fees,
      years_of_experience,
      blood_type,
      emergencyContacts,
      opening_time,
      closing_time,
      lab_name,
    ],
  );

  await db.query('COMMIT'); // commit transaction

  res.status(201).json({
    status: 'success',
    message: 'User created successfully',
  });
});
//============== ADMIN UPDATES USER STATUS & DELETION ==============
export const updateStatus = catchAsync(async (req, res, next) => {
  const admin_id = req.user.national_id;
  const { user_id } = req.params;

  await db.query('CALL update_user_status($1, $2)', [user_id, admin_id]);

  res.status(201).json({
    status: 'success',
    message: 'User account is activated',
  });
});

export const deleteUsers = catchAsync(async (req, res, next) => {
  const admin_id = req.user.national_id;
  const { user_id } = req.params;

  await db.query('CALL delete_user ($1, $2)', [user_id, admin_id]);

  res.status(201).json({
    status: 'success',
    message: 'user deleted successfully',
  });
});
//============== USER UPDATES HIS PERSONAL INFO & DELETION ==============
export const deleteMyAccount = catchAsync(async (req, res, next) => {
  const nationalId = req.user.national_id;

  const result = await db.query('DELETE FROM users WHERE national_id = $1', [
    nationalId,
  ]);
  res.status(200).json({
    status: 'success',
    message: 'Your account has been deleted successfully',
  });
});

export const updatePersonalInfo = catchAsync(async (req, res, next) => {
  const { national_id, role } = req.user;

  await db.query('BEGIN');
  let img;
  if (req.file) img = req.file.cloudinaryUrl;

  const {
    name,
    birth_date,
    email,
    phone,
    password,
    address,
    appointment_fees,
    years_of_experience,
    blood_type,
    emergencyContacts,
    opening_time,
    closing_time,
    pharmacy_name,
    lab_name,
    about,
  } = req.body;
  console.log('inside backend');
  const updateUserQuery = `
      UPDATE users
      SET name       = COALESCE($1, name),
          birth_date = COALESCE($2, birth_date),
          email      = COALESCE($3, email),
          phone      = COALESCE($4, phone),
          password   = COALESCE($5, password),
          address    = COALESCE($6, address),
          img        = COALESCE($7, img)
      WHERE national_id = $8;
    `;
  const userParams = [
    name,
    birth_date,
    email,
    phone,
    password,
    address,
    img || null,
    national_id,
  ];
  await db.query(updateUserQuery, userParams);

  if (role === 'doctor') {
    const updateDoctorQuery = `
        UPDATE doctor
        SET appointment_fees    = COALESCE($1, appointment_fees),
            years_of_experience = COALESCE($2, years_of_experience),
            about               = COALESCE($3, about)
        WHERE doctor_id = $4;
      `;
    await db.query(updateDoctorQuery, [
      appointment_fees,
      years_of_experience || null,
      about,
      national_id,
    ]);
  } else if (role === 'patient') {
    const updatePatientQuery = `
        UPDATE patient
        SET blood_type = COALESCE($1, blood_type)
        WHERE patient_id = $2;
      `;
    await db.query(updatePatientQuery, [blood_type, national_id]);

    if (emergencyContacts && emergencyContacts.length > 0) {
      await db.query(` DELETE FROM emergency_contact WHERE patient_id = $1`, [
        national_id,
      ]);

      for (let phone of emergencyContacts) {
        await db.query(
          `INSERT INTO emergency_contact (patient_id, phone) VALUES ($1, $2)`,
          [national_id, phone],
        );
      }
    }
  } else if (role === 'pharmacist') {
    const updatePharmacistQuery = `
        UPDATE pharmacist
        SET opening_time  = COALESCE($1, opening_time),
            closing_time  = COALESCE($2, closing_time),
            about         = COALESCE($3, about),
            pharmacy_name = COALESCE($4, pharmacy_name)
        WHERE pharmacist_id = $5;
      `;
    await db.query(updatePharmacistQuery, [
      opening_time,
      closing_time,
      about,
      pharmacy_name,
      national_id,
    ]);
  } else if (role === 'lab_technician') {
    const updateLabTechQuery = `
        UPDATE lab_technician
        SET opening_time = COALESCE($1, opening_time),
            closing_time = COALESCE($2, closing_time),
            about        = COALESCE($3, about),
            lab_name     = COALESCE($4, lab_name)
        WHERE labtechnician_id = $5;
      `;
    await db.query(updateLabTechQuery, [
      opening_time,
      closing_time,
      about,
      lab_name,
      national_id,
    ]);
  }

  await db.query('COMMIT');

  const selectQuery = `
      SELECT u.*, 
             d.appointment_fees,d.license as doctor_license, d.Years_of_Experience, d.about AS doctor_about, d.specialization ,
             p.blood_type, ec.phone AS emergency_contact,
             ph.opening_time AS ph_opening, ph.closing_time AS ph_closing, ph.about AS ph_about, ph.pharmacy_name, ph.license AS pharmacy_license,
             l.opening_time AS lab_opening, l.closing_time AS lab_closing, l.about AS lab_about, l.lab_name, l.license AS lab_license
      FROM users u
      LEFT JOIN doctor d ON u.national_id = d.doctor_id
      LEFT JOIN patient p ON u.national_id = p.patient_id
      LEFT JOIN emergency_contact ec ON ec.patient_id = p.patient_id
      LEFT JOIN pharmacist ph ON u.national_id = ph.pharmacist_id
      LEFT JOIN lab_technician l ON u.national_id = l.labtechnician_id
      WHERE u.national_id = $1;
    `;
  const updatedUser = (await db.query(selectQuery, [national_id])).rows[0];

  res.status(200).json({
    status: 'success',
    message: 'User information updated successfully',
    user: updatedUser,
  });
});
//=========================== GET ALL DOCTORS, PHARMACISTS, LABS ===========================
export const getAllDoctors = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  // ================= TOTAL COUNT =================
  const countResult = await db.query(
    `
    SELECT COUNT(*) AS total
    FROM users
    WHERE role = 'doctor'
    `,
  );
  const totalRows = Number(countResult.rows[0].total);
  const totalPages = Math.ceil(totalRows / limit);

  // ================= FETCH DOCTORS =================
  const dataQuery = `
    SELECT
      national_id,
      name,
      email,
      phone,
      license,
      specialization,
      appointment_fees,
      years_of_experience,
      about,
      rating,
      img
    FROM users
    JOIN doctor ON doctor_id = national_id
    WHERE role = 'doctor'
    ORDER BY rating DESC
    LIMIT $1 OFFSET $2
  `;
  const { rows } = await db.query(dataQuery, [limit, offset]);

  res.status(200).json({
    status: 'success',
    page: Number(page),
    totalPages,
    results: rows.length,
    totalRows,
    data: rows,
  });
});

export const getAllPharmacists = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  // ================= TOTAL COUNT =================
  const countResult = await db.query(
    `
    SELECT COUNT(*) AS total
    FROM users
    WHERE role = 'pharmacist'
    `,
  );
  const totalRows = Number(countResult.rows[0].total);
  const totalPages = Math.ceil(totalRows / limit);

  // ================= FETCH DOCTORS =================
  const dataQuery = `
    SELECT
      national_id,
      name,
      email,
      phone,
      license,
      opening_time,
      closing_time,
      pharmacy_name
      rating,
      address,
      pharmacy_name,
      img
    FROM users
    JOIN pharmacist ON pharmacist_id = national_id
    WHERE role = 'pharmacist'
    ORDER BY rating DESC
    LIMIT $1 OFFSET $2
  `;
  const { rows } = await db.query(dataQuery, [limit, offset]);

  res.status(200).json({
    status: 'success',
    page: Number(page),
    totalPages,
    results: rows.length,
    totalRows,
    data: rows,
  });
});

export const getAllLabs = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  // ================= TOTAL COUNT =================
  const countResult = await db.query(`
    SELECT COUNT(*) AS total
    FROM users
    WHERE role = 'lab_technician'
  `);

  const totalRows = Number(countResult.rows[0].total);
  const totalPages = Math.ceil(totalRows / limit);

  // ================= FETCH LABS WITH REVIEW COUNT =================
  const dataQuery = `
    SELECT
      u.national_id,
      u.name,
      u.email,
      u.img,
      u.phone,
      u.address,
      lt.license,
      lt.opening_time,
      lt.closing_time,
      lt.lab_name,
      COALESCE(r.review_count, 0) AS review_count
    FROM users u
    JOIN lab_technician lt
      ON lt.labtechnician_id = u.national_id
    LEFT JOIN (
      SELECT target_id, COUNT(*) AS review_count
      FROM reviews
      WHERE target_role = 'lab_technician'
      GROUP BY target_id
    ) r
      ON r.target_id = u.national_id
    WHERE u.role = 'lab_technician'
    ORDER BY review_count DESC
    LIMIT $1 OFFSET $2
  `;

  const { rows } = await db.query(dataQuery, [limit, offset]);

  res.status(200).json({
    status: 'success',
    page: Number(page),
    totalPages,
    results: rows.length,
    totalRows,
    data: rows,
  });
});
//============== GET DOCTOR BY NATIONAL ID ==============
export const getDoctor = catchAsync(async (req, res, next) => {
  const { nationalId } = req.query;
  const { page = 1, limit = 10 } = req.query;
  // 1. Check if nationalId exists

  // 2. Use $1 for security
  const dataQuery = `
    SELECT
      u.national_id,
      d.doctor_id,
      img,
      name,
      email,
      phone,
      specialization,
      appointment_fees,
      years_of_experience,
      about,
      rating,
      weekday,
      start_hour,
      end_hour,
      status,
      role
    FROM doctor d
    LEFT JOIN users u ON u.national_id = d.doctor_id
    LEFT JOIN shift_schedule s ON d.doctor_id = s.doctor_id
    WHERE u.national_id = $1
  `;

  // 3. Pass values in the array (prevents hacking)
  const { rows } = await db.query(dataQuery, [nationalId]);
  console.log(rows);
  res.status(200).json({
    status: 'success',
    results: rows.length,
    data: rows,
  });
});
//============== SEARCH DOCTORS BY SPECIALITY ==============
export const getDoctorSpeciality = catchAsync(async (req, res, next) => {
  const { specialization } = req.query;

  // ================= FILTER =================
  let whereClause = `WHERE u.role = 'doctor'`;
  const params = [];

  if (specialization && specialization !== '') {
    params.push(`%${specialization}%`);
    whereClause += ` AND d.specialization ILIKE $${params.length}`;
  } else {
    whereClause += ` AND 1 = 0`;
  }

  // ================= DATA =================
  const dataQuery = `
    SELECT
      u.national_id,
      u.name,
      d.specialization,
      d.appointment_fees,
      d.years_of_experience,
      d.rating,
      d.about
    FROM users u
    JOIN doctor d ON d.doctor_id = u.national_id
    ${whereClause}
    ORDER BY d.rating DESC
  `;

  const { rows } = await db.query(dataQuery, params);

  res.status(200).json({
    status: 'success',
    results: rows.length,
    data: rows,
  });
});
//============== SEARCH PHARMACISTS BY NAME ==============
export const getPharmacist = catchAsync(async (req, res, next) => {
  const { name } = req.query;

  // ================= FILTER =================
  let whereClause = `WHERE u.role = 'pharmacist'`;
  const params = [];

  if (name && name.trim() !== '') {
    params.push(`%${name}%`);
    whereClause += ` AND p.pharmacy_name ILIKE $${params.length}`;
  } else {
    whereClause += ` AND 1 = 0`;
  }

  // ================= DATA =================
  const dataQuery = `
    SELECT
      u.national_id AS pharmacist_id,
      u.name,
      p.pharmacy_name,
      p.rating,
      p.about
    FROM users u
    JOIN pharmacist p ON p.pharmacist_id = u.national_id
    ${whereClause}
    ORDER BY p.rating DESC
  `;

  const { rows } = await db.query(dataQuery, params);

  res.status(200).json({
    status: 'success',
    results: rows.length,
    data: rows,
  });
});
//============== SEARCH LABS BY NAME ==============
export const getLab = catchAsync(async (req, res, next) => {
  const { name } = req.query;

  // ================= FILTER =================
  let whereClause = `WHERE u.role = 'lab_technician'`;
  const params = [];

  if (name && name.trim() !== '') {
    params.push(`%${name}%`);
    whereClause += ` AND l.lab_name ILIKE $${params.length}`;
  } else {
    whereClause += ` AND 1 = 0`;
  }

  // ================= DATA =================
  const dataQuery = `
    SELECT
      u.national_id AS lab_technician_id,
      u.name,
      l.lab_name,
      l.rating,
      l.about
    FROM users u
    JOIN lab_technician l ON l.labtechnician_id = u.national_id
    ${whereClause}
    ORDER BY l.rating DESC
  `;

  const { rows } = await db.query(dataQuery, params);

  res.status(200).json({
    status: 'success',
    results: rows.length,
    data: rows,
  });
});
// ============== GET PATIENTS FOR A PHARMACIST (SEARCH + PAGINATION) ==============
export const getPatientsForPharmacist = catchAsync(async (req, res, next) => {
  const pharmacist_id = req.user.national_id;
  const { page = 1, limit = 10, search = '' } = req.query;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const offset = (pageNum - 1) * limitNum;

  let whereClauses = ['ph.pharmacist_id = $1'];
  let values = [pharmacist_id];
  let idx = 2;
  const cleanSearch = String(search).replace(/\s+/g, ' ').trim();

  if (cleanSearch !== '') {
    whereClauses.push(`u.name ILIKE $${idx}`);
    values.push(`%${cleanSearch}%`);
    idx++;
  }

  const whereSQL = 'WHERE ' + whereClauses.join(' AND ');

  // ================= TOTAL COUNT =================
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM (
      SELECT u.national_id
      FROM users u
      JOIN medicine_order m ON u.national_id = m.patient_id
      JOIN pharmacist ph ON m.pharmacist_id = ph.pharmacist_id
      ${whereSQL}
      GROUP BY u.national_id
    ) patients;
  `;
  const countResult = await db.query(countQuery, values);

  const totalRows = Number(countResult.rows[0].total);
  const totalPages = Math.ceil(totalRows / limitNum);

  // ================= PAGINATED DATA =================
  const dataQuery = `
    SELECT
      u.national_id,
      u.name,
      MAX(m.pickup_date) AS last_pickup,
      COUNT(m.order_id) AS prescriptions_count
    FROM users u
    JOIN medicine_order m ON u.national_id = m.patient_id
    JOIN pharmacist ph ON m.pharmacist_id = ph.pharmacist_id
    ${whereSQL}
    GROUP BY u.national_id, u.name
    ORDER BY last_pickup DESC
    LIMIT $${idx} OFFSET $${idx + 1};
  `;

  values.push(limitNum, offset);

  const { rows } = await db.query(dataQuery, values);

  res.status(200).json({
    status: 'success',
    page: pageNum,
    totalPages,
    results: rows.length,
    totalRows,
    data: rows,
  });
});
// ================= GET PATIENTS OF A DOCTOR (SEARCH + PAGINATION) =================
export const getPatientsForDoctor = catchAsync(async (req, res, next) => {
  const doctor_id = req.user.national_id;
  const { page = 1, limit = 10, search = '' } = req.query;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const offset = (pageNum - 1) * limitNum;

  // ================= WHERE CLAUSES =================
  let whereClauses = ['d.doctor_id = $1', "a.status = 'completed'"];
  let values = [doctor_id];
  let idx = 2;

  // SEARCH CONDITION (NAME ONLY)
  if (search.trim() !== '') {
    whereClauses.push(`u.name ILIKE $${idx}`);
    values.push(`%${search}%`);
    idx++;
  }

  const whereSQL = 'WHERE ' + whereClauses.join(' AND ');

  // ================= TOTAL COUNT =================
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM (
      SELECT u.national_id
      FROM users u
      JOIN appointments a ON u.national_id = a.patient_id
      JOIN doctor d ON a.doctor_id = d.doctor_id
      ${whereSQL}
      GROUP BY u.national_id
    ) AS patients;
  `;

  const countResult = await db.query(countQuery, values);
  const totalRows = parseInt(countResult.rows[0].total, 10);
  const totalPages = Math.ceil(totalRows / limitNum);

  // ================= PAGINATED DATA =================
  const dataQuery = `
    SELECT
      u.national_id,
      u.name,
      MAX(a."date") AS aDate,
      COUNT(DISTINCT a.appointment_id) AS appointments_count,
      COUNT(DISTINCT mr.record_id) AS medical_records_count
    FROM users u
    JOIN appointments a ON u.national_id = a.patient_id
    JOIN doctor d ON a.doctor_id = d.doctor_id
    LEFT JOIN medical_records mr
      ON mr.patient_id = u.national_id
     AND mr.doctor_id = d.doctor_id
    ${whereSQL}
    GROUP BY u.national_id, u.name
    ORDER BY aDate DESC
    LIMIT $${idx} OFFSET $${idx + 1};
  `;

  values.push(limitNum, offset);
  const { rows } = await db.query(dataQuery, values);

  // ================= MAPPING FOR FRONT-END =================
  const patients = rows.map((p) => ({
    id: p.national_id,
    name: p.name,
    date: p.aDate,
    appointments: p.appointments_count,
    medicalRecords: p.medical_records_count,
  }));

  // ================= RESPONSE =================
  res.status(200).json({
    status: 'success',
    page: pageNum,
    totalPages,
    results: patients.length,
    totalRows,
    data: patients,
  });
});
//================= GET MEDICAL RECORDS OF A PATIENT FOR A DOCTOR =================
export const getMedicalRecordsForPatient = catchAsync(
  async (req, res, next) => {
    const doctor_id = req.user.national_id;
    const { patientId } = req.params;

    const query = `
    SELECT
      diagnose,
      notes,
      created_at,
      treatment_plan
    FROM medical_records
    WHERE doctor_id = $1
      AND patient_id = $2
    ORDER BY created_at DESC;
  `;

    const { rows } = await db.query(query, [doctor_id, patientId]);

    res.status(200).json({
      status: 'success',
      results: rows.length,
      data: rows,
    });
  },
);
//==================== GET PRESCRIPTIONS OF A PATIENT FOR A DOCTOR =================
export const getPrescriptionsForPatient = catchAsync(async (req, res, next) => {
  const doctor_id = req.user.national_id;
  const { patientId } = req.params;

  const query = `
    SELECT
      p.prescription_id,
      p."date",
      p.expired_date,
      m.name AS medication_name,
      pm.dose,
      pm.note AS medication_note
    FROM prescription p
    JOIN prescription_medications pm
      ON pm.prescription_id = p.prescription_id
    JOIN medications m
      ON m.medication_id = pm.medicine_id
    WHERE p.doctor_id = $1
      AND p.patient_id = $2
    ORDER BY p."date" DESC;
  `;

  const { rows } = await db.query(query, [doctor_id, patientId]);

  // ================= GROUP MEDICATIONS PER PRESCRIPTION =================
  const prescriptionsMap = {};

  rows.forEach((row) => {
    if (!prescriptionsMap[row.prescription_id]) {
      prescriptionsMap[row.prescription_id] = {
        prescriptionId: row.prescription_id,
        date: row.date,
        expiredDate: row.expired_date,
        notes: row.notes,
        medications: [],
      };
    }

    prescriptionsMap[row.prescription_id].medications.push({
      name: row.medication_name,
      dose: row.dose,
      note: row.medication_note,
    });
  });

  const prescriptions = Object.values(prescriptionsMap);

  res.status(200).json({
    status: 'success',
    results: prescriptions.length,
    data: prescriptions,
  });
}); //=================== GET LAB TESTS OF A PATIENT FOR A DOCTOR =================
export const getLabTestsForPatient = catchAsync(async (req, res, next) => {
  const doctor_id = req.user.national_id;
  const { patientId } = req.params;

  const query = `
    SELECT
      lt.labtest_id,
      le.test_name,
      lt."date" AS test_date,
      lt.status,
      lr.result AS result_url
    FROM lab_test lt
    JOIN labexaminations le
      ON le.test_id = lt.test_type
    LEFT JOIN lab_results lr
      ON lr.labtest_id = lt.labtest_id
    WHERE lt.doctor_id = $1
      AND lt.patient_id = $2
    ORDER BY lt."date" DESC;
  `;

  const { rows } = await db.query(query, [doctor_id, patientId]);

  res.status(200).json({
    status: 'success',
    results: rows.length,
    data: rows,
  });
});
//=================================== ADMIN STATISTICS ===================================
//================== COUNT OF PATIENTS =================
export const getPatientsCount = catchAsync(async (req, res, next) => {
  const result = await db.query(`
    SELECT COUNT(*) AS count
    FROM users
    WHERE role = 'patient'
  `);

  res.status(200).json({
    status: 'success',
    count: Number(result.rows[0].count),
  });
});
//================== COUNT OF MEDICATIONS =================
export const getMedicationsCount = catchAsync(async (req, res, next) => {
  const result = await db.query(`
    SELECT COUNT(*) AS count
    FROM medications
  `);

  res.status(200).json({
    status: 'success',
    count: Number(result.rows[0].count),
  });
});
//================== TOTAL STOCK OF MEDICATIONS =================
export const getMedicationsStockCount = catchAsync(async (req, res, next) => {
  const result = await db.query(`
    SELECT COALESCE(SUM(quantity), 0) AS total_stock
    FROM availablemedications
  `);

  res.status(200).json({
    status: 'success',
    totalStock: Number(result.rows[0].total_stock),
  });
});
//================== COUNT OF MEDICATION COMPANIES =================
export const getMedicationCompaniesCount = catchAsync(
  async (req, res, next) => {
    const result = await db.query(`
    SELECT COUNT(DISTINCT company) AS count
    FROM medications
  `);

    res.status(200).json({
      status: 'success',
      count: Number(result.rows[0].count),
    });
  },
);
//================== COUNT OF LAB EXAMINATIONS =================
export const getLabExaminationsCount = catchAsync(async (req, res, next) => {
  const result = await db.query(`
    SELECT COUNT(*) AS count
    FROM labexaminations
  `);

  res.status(200).json({
    status: 'success',
    count: Number(result.rows[0].count),
  });
});
//==================== APPOINTMENTS STATISTICS =================
export const getAppointmentsStats = catchAsync(async (req, res, next) => {
  const totalResult = await db.query(`
    SELECT COUNT(*) AS total
    FROM appointments
  `);

  const monthlyResult = await db.query(`
    SELECT
      TO_CHAR(date, 'MM') AS month,
      COUNT(*) AS count
    FROM appointments
    GROUP BY month
    ORDER BY month
  `);

  res.status(200).json({
    status: 'success',
    totalAppointments: Number(totalResult.rows[0].total),
    monthly: monthlyResult.rows,
  });
});
//================== COUNT OF PRESCRIPTIONS =================
export const getPrescriptionsCount = catchAsync(async (req, res, next) => {
  const result = await db.query(`
    SELECT COUNT(*) AS count
    FROM prescription
  `);

  res.status(200).json({
    status: 'success',
    count: Number(result.rows[0].count),
  });
});
//================== COUNT OF ADMINS =================
export const getAdminsCount = catchAsync(async (req, res, next) => {
  const result = await db.query(`
    SELECT COUNT(*) AS count
    FROM users
    WHERE role = 'admin'
  `);

  res.status(200).json({
    status: 'success',
    count: Number(result.rows[0].count),
  });
});
//================== APPOINTMENTS REVENUE PER MONTH =================
export const getAppointmentsRevenuePerMonth = catchAsync(
  async (req, res, next) => {
    const result = await db.query(`
      SELECT
        TO_CHAR(a."date", 'MM') AS month,
        SUM(d.appointment_fees) AS total_revenue
      FROM appointments a
      JOIN doctor d
        ON a.doctor_id = d.doctor_id
      WHERE a.status = 'completed'
      GROUP BY month
      ORDER BY month;
    `);

    res.status(200).json({
      status: 'success',
      results: result.rows.length,
      data: result.rows.map((row) => ({
        month: row.month,
        totalRevenue: Number(row.total_revenue),
      })),
    });
  },
);
//================== ACTIVE DOCTORS TODAY =================
export const getActiveDoctorsToday = catchAsync(async (req, res, next) => {
  const result = await db.query(`
    SELECT COUNT(*) AS count
    FROM users
    WHERE role = 'doctor'
      AND last_seen::date = CURRENT_DATE
  `);

  console.log(Number(result.rows[0].count));
  res.status(200).json({
    status: 'success',
    activeDoctors: Number(result.rows[0].count),
  });
});
//================== COUNT OF DOCTORS =================
export const getDoctorsCount = catchAsync(async (req, res, next) => {
  const result = await db.query(`
    SELECT COUNT(*) AS count
    FROM users
    WHERE role = 'doctor'
  `);

  res.status(200).json({
    status: 'success',
    doctors: Number(result.rows[0].count),
  });
});
//================== ACTIVE ADMINS TODAY =================
export const getActiveAdminsToday = catchAsync(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = await db.query(
    `
    SELECT COUNT(*) AS count
    FROM users
    WHERE role = 'admin'
      AND last_seen >= $1
  `,
    [today],
  );

  res.status(200).json({
    status: 'success',
    count: Number(result.rows[0].count),
  });
});
//================== GET ALL USERS WITH FILTERS AND PAGINATION =================
export const getAllUsers = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, role, search = '' } = req.query;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const offset = (pageNum - 1) * limitNum;

  // ================= WHERE CLAUSES =================
  const whereClauses = [];
  const values = [];
  let idx = 1;

  // ROLE FILTER
  if (role) {
    whereClauses.push(`role = $${idx}`);
    values.push(role.toLowerCase());
    idx++;
  }

  // NAME SEARCH
  if (search.trim() !== '') {
    whereClauses.push(`name ILIKE $${idx}`);
    values.push(`%${search}%`);
    idx++;
  }

  const whereSQL =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // ================= TOTAL COUNT =================
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM users
    ${whereSQL};
  `;

  const countResult = await db.query(countQuery, values);
  const totalRows = Number(countResult.rows[0].total);
  const totalPages = Math.ceil(totalRows / limitNum);

  // ================= FETCH USERS =================
  const dataQuery = `
    SELECT
      national_id,
      name,
      email,
      phone,
      role,
      created_on,
      last_seen,
      status
    FROM users
    ${whereSQL}
    ORDER BY created_on DESC
    LIMIT $${idx} OFFSET $${idx + 1};
  `;

  values.push(limitNum, offset);

  const { rows } = await db.query(dataQuery, values);
  console.log(rows);
  res.status(200).json({
    status: 'success',
    page: pageNum,
    totalPages,
    results: rows.length,
    totalRows,
    data: rows,
  });
});
// ============== GET PATIENT PROFILE + ORDERS (PHARMACIST) ==============
export const getPatientProfileForPharmacist = catchAsync(
  async (req, res, next) => {
    const pharmacist_id = req.user.national_id;
    const { patientId } = req.params;

    // ================= PATIENT BASIC INFO =================
    const patientQuery = `
      SELECT DISTINCT
        u.national_id,
        u.name,
        u.email,
        u.phone
      FROM users u
      JOIN medicine_order mo
        ON mo.patient_id = u.national_id
      WHERE u.national_id = $1
        AND mo.pharmacist_id = $2;
    `;

    const patientResult = await db.query(patientQuery, [
      patientId,
      pharmacist_id,
    ]);

    if (patientResult.rowCount === 0) {
      return next(
        new AppError('Patient not found or has no orders with you', 404),
      );
    }

    const patient = patientResult.rows[0];

    // ================= PATIENT ORDERS =================
    const ordersQuery = `
      SELECT
        mo.order_id,
        mo.status,
        mo.order_date,
        mo.pickup_date,
        m.medication_id,
        m.name AS medication_name,
        moi.quantity
      FROM medicine_order mo
      JOIN medicine_order_item moi
        ON moi.order_id = mo.order_id
      JOIN medications m
        ON m.medication_id = moi.medicine_id
      WHERE mo.patient_id = $1
        AND mo.pharmacist_id = $2
      ORDER BY mo.order_date DESC;
    `;

    const ordersResult = await db.query(ordersQuery, [
      patientId,
      pharmacist_id,
    ]);

    // ================= GROUP ORDERS =================
    const ordersMap = {};

    ordersResult.rows.forEach((row) => {
      if (!ordersMap[row.order_id]) {
        ordersMap[row.order_id] = {
          orderId: row.order_id,
          status: row.status,
          orderDate: row.order_date,
          pickupDate: row.pickup_date,
          medications: [],
        };
      }

      ordersMap[row.order_id].medications.push({
        medicationId: row.medication_id,
        name: row.medication_name,
        quantity: row.quantity,
      });
    });

    const orders = Object.values(ordersMap);

    // ================= RESPONSE =================
    res.status(200).json({
      status: 'success',
      data: {
        patient: {
          id: patient.national_id,
          name: patient.name,
          email: patient.email,
          phone: patient.phone,
        },
        orders,
      },
    });
  },
);
// ================= GET SINGLE DOCTOR PROFILE (PATIENT) =================
export const getDoctorProfile = catchAsync(async (req, res, next) => {
  const { doctorId } = req.params;

  const query = `
    SELECT 
      u.national_id,
      u.name,
      u.img,
      u.address,
      u.phone,
      u.email,
      d.specialization,
      d.rating,
      d.about,
      d.years_of_experience,
      COALESCE(
        json_agg(
          json_build_object(
            'weekday', s.weekday,
            'start_hour', s.start_hour,
            'end_hour', s.end_hour
          )
        ) FILTER (WHERE s.weekday IS NOT NULL),
        '[]'
      ) AS schedule
    FROM users u
    JOIN doctor d
      ON d.doctor_id = u.national_id
    LEFT JOIN shift_schedule s
      ON s.doctor_id = u.national_id
    WHERE u.national_id = $1
      AND u.role = 'doctor'
      AND u.status = 'active'
    GROUP BY 
      u.national_id,
      u.name,
      u.img,
      u.address,
      u.phone,
      u.email,
      d.specialization,
      d.rating,
      d.about,
      d.years_of_experience;
  `;

  const { rows } = await db.query(query, [doctorId]);

  if (rows.length === 0) {
    return next(new AppError('Doctor not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: rows[0],
  });
});
// ================= GET SINGLE LAB TECHNICIAN PROFILE (PATIENT) =================
export const getLabTechnicianProfile = catchAsync(async (req, res, next) => {
  const { labTechnicianId } = req.params;

  const query = `
    SELECT
      u.national_id, u.name, u.img, u.phone, u.address,
      lt.lab_name, lt.about, lt.opening_time, lt.closing_time, lt.rating, lt.license
    FROM users u
    JOIN lab_technician lt
      ON lt.labtechnician_id = u.national_id
    WHERE u.national_id = $1
      AND u.role = 'lab_technician'
      AND u.status = 'active';
  `;

  const { rows } = await db.query(query, [labTechnicianId]);

  if (rows.length === 0) {
    return next(new AppError('Lab technician not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: rows[0],
  });
});
export const getPharmacistProfile = catchAsync(async (req, res, next) => {
  const { pharmacistId } = req.params;

  const query = `
    SELECT
      u.national_id,
      u.name,
      u.img,
      u.phone,
      u.address,
      u.email,
      p.pharmacy_name,
      p.about,
      p.opening_time,
      p.closing_time,
      p.rating,
      p.license
    FROM users u
    JOIN pharmacist p
      ON p.pharmacist_id = u.national_id
    WHERE u.national_id = $1
      AND u.role = 'pharmacist'
      AND u.status = 'active';
  `;

  const { rows } = await db.query(query, [pharmacistId]);

  if (rows.length === 0) {
    return next(new AppError('Pharmacist not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: rows[0],
  });
});

//================== COUNT OF LABS =================
export const getLabsCount = catchAsync(async (req, res, next) => {
  const query = `
    SELECT COUNT(*) AS count
    FROM users u
    WHERE u.role = 'lab_technician';
  `;

  const { rows } = await db.query(query);

  res.status(200).json({
    status: 'success',
    data: {
      count: rows[0].count,
    },
  });
});
//================== COUNT OF PHARMACISTS =================
export const getPharmacistsCount = catchAsync(async (req, res, next) => {
  const query = `
    SELECT COUNT(*) AS count
    FROM users u
    WHERE u.role = 'pharmacist';
  `;

  const { rows } = await db.query(query);

  res.status(200).json({
    status: 'success',
    data: {
      count: rows[0].count,
    },
  });
});

// ================= GET SINGLE PATIENT DETAILS =================
export const getPatientDetails = catchAsync(async (req, res, next) => {
  const { patientId } = req.params;

  const query = `
    SELECT
      u.*,
      p.blood_type,
      e.phone AS emergency_phone
    FROM users u
    JOIN patient p
      ON u.national_id = p.patient_id
    LEFT JOIN emergency_contact e
      ON p.patient_id = e.patient_id
    WHERE u.national_id = $1
  `;

  const { rows } = await db.query(query, [patientId]);

  if (rows.length === 0) {
    return res.status(404).json({
      status: 'fail',
      message: 'Patient not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: rows[0],
  });
});

// ============== GET PATIENT PROFILE + LAB TESTS (LAB TECHNICIAN) ==============
export const getPatientProfileForLabTechnician = catchAsync(
  async (req, res, next) => {
    const labtechnician_id = req.user.national_id;
    const { patientId } = req.params;

    // ================= PATIENT BASIC INFO =================
    const patientQuery = `
      SELECT DISTINCT
        u.national_id,
        u.name,
        u.email,
        u.phone
      FROM users u
      JOIN lab_test lt
        ON lt.patient_id = u.national_id
      WHERE u.national_id = $1
        AND lt.labtechnician_id = $2;
    `;

    const patientResult = await db.query(patientQuery, [
      patientId,
      labtechnician_id,
    ]);

    if (patientResult.rowCount === 0) {
      return next(
        new AppError(
          'Patient not found or has no lab tests assigned to you',
          404,
        ),
      );
    }

    const patient = patientResult.rows[0];

    // ================= PATIENT LAB TESTS =================
    const testsQuery = `
      SELECT
        lt.labtest_id,
        lt."date" AS test_date,
        lt.status,
        lt.doctor_id,
        le.test_name,
        lr.result AS result_url
      FROM lab_test lt
      JOIN labexaminations le
        ON le.test_id = lt.test_type
      LEFT JOIN lab_results lr
        ON lr.labtest_id = lt.labtest_id
      WHERE lt.patient_id = $1
        AND lt.labtechnician_id = $2
      ORDER BY lt."date" DESC;
    `;

    const testsResult = await db.query(testsQuery, [
      patientId,
      labtechnician_id,
    ]);

    // ================= RESPONSE =================
    res.status(200).json({
      status: 'success',
      data: {
        patient: {
          id: patient.national_id,
          name: patient.name,
          email: patient.email,
          phone: patient.phone,
        },
        labTests: testsResult.rows.map((t) => ({
          labTestId: t.labtest_id,
          testName: t.test_name,
          date: t.test_date,
          status: t.status,
          doctorId: t.doctor_id,
          result: t.result_url,
        })),
      },
    });
  },
);

export const getPatientsForLabTechnician = catchAsync(
  async (req, res, next) => {
    const labtechnician_id = req.user.national_id;
    const { page = 1, limit = 10, search = '' } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const offset = (pageNum - 1) * limitNum;

    let whereClauses = ['lt.labtechnician_id = $1'];
    let values = [labtechnician_id];
    let idx = 2;
    const cleanSearch = String(search).replace(/\s+/g, ' ').trim();

    if (cleanSearch !== '') {
      whereClauses.push(`u.name ILIKE $${idx}`);
      values.push(`%${cleanSearch}%`);
      idx++;
    }

    const whereSQL = 'WHERE ' + whereClauses.join(' AND ');

    // ================= TOTAL COUNT =================
    const countQuery = `
    SELECT COUNT(*) AS total
    FROM (
      SELECT u.national_id
      FROM users u
      JOIN lab_test lt ON u.national_id = lt.patient_id
      ${whereSQL}
      GROUP BY u.national_id
    ) patients;
  `;
    const countResult = await db.query(countQuery, values);

    const totalRows = Number(countResult.rows[0].total);
    const totalPages = Math.ceil(totalRows / limitNum);

    // ================= PAGINATED DATA =================
    const dataQuery = `
    SELECT
      u.national_id,
      u.name,
      MAX(lt.date) AS last_test_date,
      COUNT(lt.labtest_id) AS tests_count,
      COUNT(CASE WHEN lr.result IS NOT NULL THEN 1 END) AS completed_tests,
      COUNT(CASE WHEN lr.result IS NULL THEN 1 END) AS pending_tests
    FROM users u
    JOIN lab_test lt ON u.national_id = lt.patient_id
    LEFT JOIN lab_results lr ON lt.labtest_id = lr.labtest_id
    ${whereSQL}
    GROUP BY u.national_id, u.name
    ORDER BY last_test_date DESC
    LIMIT $${idx} OFFSET $${idx + 1};
  `;

    values.push(limitNum, offset);

    const { rows } = await db.query(dataQuery, values);

    res.status(200).json({
      status: 'success',
      page: pageNum,
      totalPages,
      results: rows.length,
      totalRows,
      data: rows,
    });
  },
);

export const getAdmins = catchAsync(async (req, res, next) => {
  const query = `
    SELECT * FROM public.users
    where role = 'admin' 
    order by last_seen desc;
  `;
  const { rows } = await db.query(query);
  console.log(rows);
  res.status(200).json({
    status: 'success',
    results: rows.length,
    data: rows,
  });
});

// Latest Activity
// export const getTodayActivity = catchAsync(async (req, res, next) => {
//   // Get today's patients
//   const todayPatients = await db.query(`
//     SELECT
//       'patient_registered' as activity_type,
//       'New patient registered' as title,
//       name as description,
//       national_id as user_id,
//       created_on
//     FROM users
//     WHERE role = 'patient' AND created_on::date = CURRENT_DATE
//     ORDER BY created_on DESC
//     limit 1
//   `);

//   // Get today's approved doctors
//   const todayDoctors = await db.query(`
//     SELECT
//       'doctor_approved' as activity_type,
//       'Doctor account approved' as title,
//       name as description,
//       national_id as user_id,
//       COALESCE(approved_at, updated_at, created_at) as created_at
//     FROM users
//     WHERE role = 'doctor'
//       AND status = 'approved'
//       AND COALESCE(approved_at, updated_at, created_at)::date = CURRENT_DATE
//     ORDER BY COALESCE(approved_at, updated_at, created_at) DESC
//   `);

//   // Get latest medication by highest ID (most recently added)
//   const latestMedication = await db.query(`
//     SELECT
//       'medication_added' as activity_type,
//       'New medication added' as title,
//       name as description,
//       medication_id::text as user_id,
//       CURRENT_TIMESTAMP as created_at
//     FROM medications
//     ORDER BY medication_id DESC
//     LIMIT 1
//   `);

//   // Get latest lab test by highest ID (most recently added)
//   const latestLabTest = await db.query(`
//     SELECT
//       'lab_test_added' as activity_type,
//       'Lab test added' as title,
//       test_name as description,
//       test_id::text as user_id,
//       CURRENT_TIMESTAMP as created_at
//     FROM labexaminations
//     ORDER BY test_id DESC
//     LIMIT 1
//   `);

//   // Get today's deleted users (if you track deletions)
//   const todayDeletedUsers = await db.query(`
//     SELECT
//       'user_deleted' as activity_type,
//       'User account deleted' as title,
//       name as description,
//       national_id as user_id,
//       deleted_at as created_at
//     FROM users
//     WHERE deleted_at IS NOT NULL
//       AND deleted_at::date = CURRENT_DATE
//     ORDER BY deleted_at DESC
//   `);

//   // Combine all activities
//   const activities = [
//     ...todayPatients.rows,
//     ...todayDoctors.rows,
//     ...latestMedication.rows,
//     ...latestLabTest.rows,
//     ...todayDeletedUsers.rows,
//   ];

//   // Sort by created_at DESC (for patients/doctors)
//   // Medications and lab tests will appear based on when they were fetched
//   activities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

//   res.status(200).json({
//     status: 'success',
//     results: activities.length,
//     data: activities,
//   });
// });
