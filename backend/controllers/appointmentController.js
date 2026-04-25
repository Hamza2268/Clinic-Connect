import db from '../db.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { pushNotification } from '../utils/notify.js';
//================== CREATE APPOINTMENT =================
// export const createAppointment = catchAsync(async (req, res, next) => {
//   const patientID = req.user.national_id;
//   const doctorID = Number(req.params.national_id);
//   const { appointment_date, start_hour, end_hour, symptoms } = req.body;

//   const notAvailable = await db.query(
//     `SELECT 1
//       FROM appointments
//       WHERE doctor_id = $1
//         AND date = $2
//         AND status <> 'cancelled'
//         AND $3 < end_hour
//         AND $4 > start_hour;
//       `,
//     [doctorID, appointment_date, start_hour, end_hour],
//   );

//   if (notAvailable.rows.length > 0) {
//     return next(new AppError('This appointment has already been booked', 403));
//   }

//   await db.query(`CALL create_appointment ($1, $2, $3, $4, $5, $6)`, [
//     patientID,
//     doctorID,
//     start_hour,
//     end_hour,
//     appointment_date,
//     symptoms,
//   ]);

//   // 🔔
//   await pushNotification({
//     national_id: patientID,
//     type: 'appointment',
//     content: `Your appointment has been booked on ${appointment_date} from ${start_hour} to ${end_hour}.`,
//   });

//   await pushNotification({
//     national_id: doctorID,
//     type: 'appointment',
//     content: `A new appointment has been booked with a patient on ${appointment_date} from ${start_hour} to ${end_hour}.`,
//   });

//   res.status(201).json({
//     status: 'success',
//     message: 'appointment created successfully',
//   });
// });
//================== CREATE APPOINTMENT =================
export const createAppointment = catchAsync(async (req, res, next) => {
  const patientID = req.user.national_id;
  const doctorID = Number(req.params.national_id);
  const { appointment_date, start_hour, end_hour, symptoms } = req.body;

  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const weekday = days[new Date(appointment_date).getDay()];
  console.log('weekday is :', weekday);
  // Check overlapping appointments
  const appointmentOverlap = (
    await db.query(
      `SELECT 1
     FROM appointments
     WHERE doctor_id = $1
       AND date = $2
       AND status <> 'cancelled'
       AND $3 < end_hour
       AND $4 > start_hour;`,
      [doctorID, appointment_date, start_hour, end_hour],
    )
  ).rows.length;

  if (appointmentOverlap) {
    return next(
      new AppError('Doctor already has an appointment in this time slot', 403),
    );
  }

  // Check doctor shift
  const shiftExists = (
    await db.query(
      `SELECT 1
     FROM shift_schedule
     WHERE doctor_id = $1
       AND weekday = $2
       AND $3 >= start_hour
       AND $4 <= end_hour;`,
      [doctorID, weekday, start_hour, end_hour],
    )
  ).rows.length;

  if (!shiftExists) {
    return next(new AppError('Doctor is not available in this shift', 403));
  }

  // Create appointment
  await db.query(`CALL create_appointment ($1, $2, $3, $4, $5, $6)`, [
    patientID,
    doctorID,
    start_hour,
    end_hour,
    appointment_date,
    symptoms,
  ]);

  // Notifications
  await pushNotification({
    national_id: patientID,
    type: 'appointment',
    content: `Your appointment has been booked on ${appointment_date} from ${start_hour} to ${end_hour}.`,
  });

  await pushNotification({
    national_id: doctorID,
    type: 'appointment',
    content: `A new appointment has been booked with a patient on ${appointment_date} from ${start_hour} to ${end_hour}.`,
  });

  res.status(201).json({
    status: 'success',
    message: 'appointment created successfully',
  });
});

//================== UPDATE APPOINTMENT STATUS =================
export const updateAppointmentStatus = catchAsync(async (req, res, next) => {
  const userID = req.user.national_id;
  const role = req.user.role;
  const appointmentID = Number(req.params.appointmentID);
  const { action } = req.body;

  let query, params;

  // Patient
  if (role === 'patient' && action === 'cancelled') {
    query = `
      UPDATE appointments
      SET status = 'cancelled'
      WHERE appointment_id = $1
        AND patient_id = $2
        AND status != 'completed'
      RETURNING *;
    `;
    params = [appointmentID, userID];
  }
  // Doctor
  else if (role === 'doctor') {
    if (action === 'cancelled') {
      query = `
        UPDATE appointments
        SET status = 'cancelled'
        WHERE appointment_id = $1
          AND doctor_id = $2
          AND status != 'completed'
        RETURNING *;
      `;
      params = [appointmentID, userID];
    } else if (action === 'completed') {
      query = `
        UPDATE appointments
        SET status = 'completed'
        WHERE appointment_id = $1
          AND doctor_id = $2
          AND status = 'in-progress'
        RETURNING *;
      `;
      params = [appointmentID, userID];
    } else {
      return next(new AppError('Invalid action for doctor', 403));
    }
  }
  // Role not allowed
  else {
    return next(new AppError('Action not allowed for you', 403));
  }

  const updated = (await db.query(query, params)).rows[0];

  if (!updated) {
    return next(new AppError('Cannot update: appointment', 400));
  }

  // 🔔
  if (updated.status === 'cancelled') {
    await pushNotification({
      national_id: updated.patient_id,
      type: 'appointment',
      content: 'Your appointment has been cancelled.',
    });

    await pushNotification({
      national_id: updated.doctor_id,
      type: 'appointment',
      content: 'An appointment with a patient has been cancelled.',
    });
  }

  if (updated.status === 'completed') {
    await pushNotification({
      national_id: updated.patient_id,
      type: 'appointment',
      content:
        'Your appointment has been completed. We hope you are feeling better 🥰.',
    });
  }

  res.status(200).json({
    status: 'success',
    data: updated,
  });
});
//================== GET APPOINTMENTS =================
export const getAppointments = catchAsync(async (req, res, next) => {
  const user_id = req.user.national_id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const { status, search = '' } = req.query;
  let whereClauses = [];
  const values = [user_id];
  let idx = 2;

  if (req.user.role === 'patient') {
    whereClauses.push(`a.patient_id = $1`);
    whereClauses.push(`a.status <>  'cancelled'`);
  } else if (req.user.role === 'doctor') {
    whereClauses.push(`a.doctor_id = $1`);
  }

  if (status) {
    whereClauses.push(`a.status = $${idx}`);
    values.push(status);
    idx++;
  }

  if (search.trim() !== '') {
    whereClauses.push(`u.name ILIKE $${idx}`);
    values.push(`%${search}%`);
    idx++;
  }

  const whereSQL =
    whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

  // ================= TOTAL COUNT =================
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM appointments a
    JOIN users u ON a.patient_id = u.national_id
    ${whereSQL};
  `;
  const countResult = await db.query(countQuery, values);
  const totalRows = parseInt(countResult.rows[0].total, 10);
  const totalPages = Math.ceil(totalRows / limit);

  // ================= PAGINATED DATA =================

  const query = `
    SELECT
      a.*,
      u.name AS patient_name,d.name as doctorName,
    dr.appointment_fees as fees,
    dr.specialization,
    d.img
    FROM appointments a
    JOIN users u ON a.patient_id = u.national_id
    join users d on a.doctor_id = d.national_id
    join doctor dr on a.doctor_id = dr.doctor_id
    ${whereSQL}
    ORDER BY a.date DESC, a.start_hour DESC
    LIMIT $${idx} OFFSET $${idx + 1};
  `;
  values.push(limit, offset);
  const results = await db.query(query, values);
  // console.log(results);
  res.status(200).json({
    status: 'success',
    limit,
    totalRows,
    totalPages,
    results: results.rows.length,
    data: results.rows,
  });
});
