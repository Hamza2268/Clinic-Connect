import db from '../db.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getRequests = catchAsync(async (req, res, next) => {
  const query = `
    (
    SELECT 
      u.name,
      u.img,
      u.role,
     -- specialization ,
      d.license,
      u.created_on
    FROM users u
    JOIN doctor d ON d.doctor_id = u.national_id
    WHERE u.role = 'doctor' AND u.status = 'pending'
  )
  UNION ALL
  (
    SELECT 
      u.name,
      u.img,
      u.role,
     -- null as specialization,
      p.license,
      u.created_on
    FROM users u
    JOIN pharmacist p ON p.pharmacist_id = u.national_id
    WHERE u.role = 'pharmacist' AND u.status = 'pending'
  )
  UNION ALL
  (
    SELECT 
      u.name,
      u.img,
      u.role,
      -- null as specialization,
      lt.license,
      u.created_on
    FROM users u
    JOIN lab_technician lt ON lt.labtechnician_id = u.national_id
    WHERE u.role = 'lab_technician' AND u.status = 'pending'
  )
  ORDER BY created_on DESC;
  `;

  const { rows } = await db.query(query);

  // console.log(rows);
  res.status(200).json({
    status: 'success',
    results: rows.length,
    data: rows,
  });
});
