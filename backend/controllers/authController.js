import jwt from 'jsonwebtoken';
import db from './../db.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import * as userModel from '../models/userModel.js';
import { promisify } from 'util';
import Email from '../utils/email.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { pushNotification } from '../utils/notify.js';

// ===================== JWT SIGNING =====================
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// ===================== SEND TOKEN & RESPONSE =====================
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user.national_id);

  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  });
};

// ===================== SIGN UP =====================

export const signUp = catchAsync(async (req, res, next) => {
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
    license,
    specialization,
    appointment_fees,
    Years_of_Experience,
    blood_type,
    emergencyContacts,
    opening_time,
    closing_time,
    pharmacy_name,
    lab_name,
    about,
  } = req.body;

  const role = req.body.role.toLowerCase();
  const gender =
    req.body.gender.charAt(0).toUpperCase() +
    req.body.gender.slice(1).toLowerCase();
  const status = role === 'patient' || role === 'admin' ? 'active' : 'pending';

  const insertUserQuery = `
    INSERT INTO Users
    (name, birth_date, email, phone, password, address, role, gender, img, created_on, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), $10)
    RETURNING *;
  `;
  const userParams = [
    name,
    birth_date,
    email,
    phone,
    password,
    address,
    role,
    gender,
    img || null,
    status,
  ];
  const newUser = (await db.query(insertUserQuery, userParams)).rows[0];
  const national_id = newUser.national_id;

  if (role === 'doctor') {
    await db.query(
      `
      INSERT INTO Doctor
      (doctor_id, license, specialization, appointment_fees, Years_of_Experience, about)
      VALUES ($1, $2, $3, $4, $5, $6);
    `,
      [
        national_id,
        license,
        specialization,
        appointment_fees,
        Years_of_Experience || null,
        about,
      ]
    );
  } else if (role === 'patient') {
    await db.query(
      `
      INSERT INTO Patient (patient_id, blood_type)
      VALUES ($1, $2);
    `,
      [national_id, blood_type]
    );

    if (emergencyContacts && emergencyContacts.length > 0) {
      await db.query(
        `
          INSERT INTO emergency_contact (patient_id, phone) VALUES ($1, $2);
        `,
        [national_id, phone]
      );
    }
  } else if (role === 'pharmacist') {
    await db.query(
      `
      INSERT INTO Pharmacist
      (pharmacist_id, opening_time, closing_time, license, pharmacy_name, about)
      VALUES ($1, $2, $3, $4, $5, $6);
    `,
      [national_id, opening_time, closing_time, license, pharmacy_name, about]
    );
  } else if (role === 'lab_technician') {
    await db.query(
      `
      INSERT INTO Lab_technician
      (labtechnician_id, license, opening_time, closing_time, lab_name, about)
      VALUES ($1, $2, $3, $4, $5, $6);
    `,
      [national_id, license, opening_time, closing_time, lab_name, about]
    );
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
  const fullUser = (await db.query(selectQuery, [national_id])).rows[0];

  if (newUser.status === 'pending') {
    res.status(201).json({
      status: 'success',
      message:
        'Your account is pending. Please wait until an admin activates it.',
      user: fullUser,
    });
  } else {
    const token = signToken(newUser.national_id);
    res.status(201).json({
      status: 'success',
      token,
      message: 'User registered successfully',
      user: fullUser,
    });
  }
});
// ===================== LOGIN =====================
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email & password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists and password is correct
  const findQuery = `SELECT u.*, 
             d.appointment_fees, d.license as doctor_license, d.Years_of_Experience, d.about as doctor_about, d.specialization ,
             p.blood_type, ec.phone AS emergency_contact,
             ph.opening_time AS ph_opening, ph.closing_time AS ph_closing, ph.about AS ph_about, ph.pharmacy_name, ph.license AS pharmacy_license,
             l.opening_time AS lab_opening, l.closing_time AS lab_closing, l.about AS lab_about, l.lab_name, l.license AS lab_license
      FROM users u
      LEFT JOIN doctor d ON u.national_id = d.doctor_id
      LEFT JOIN patient p ON u.national_id = p.patient_id
      LEFT JOIN emergency_contact ec ON ec.patient_id = p.patient_id
      LEFT JOIN pharmacist ph ON u.national_id = ph.pharmacist_id
      LEFT JOIN lab_technician l ON u.national_id = l.labtechnician_id
      WHERE u.email = $1;`;
  const user = (await db.query(findQuery, [email])).rows[0];

  if (!user || !(await userModel.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 4) check if status pending or inactive
  if (user.role !== 'patient') {
    if (user.status === 'pending') {
      return next(new AppError('Your account is still pending'));
    }

    if (user.status === 'inactive') {
      return next(
        new AppError('Your account is inactive. Return to Admin to activate it')
      );
    }
  }

  // 3) If everything ok, send token
  createSendToken(user, 200, req, res);
});

export const protect = catchAsync(async (req, res, next) => {
  // 1) Getting the token and check if it's there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError(`you aren't logged in! please log in to get access`, 401)
    );
  }

  // 2) verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Check if user still exits
  const findQuery = `SELECT * FROM users WHERE national_id = $1;`;

  const currentUser = (await db.query(findQuery, [decoded.id])).rows[0];
  if (!currentUser) {
    return next(
      new AppError(`The user belonging to this token no longer exists`, 401)
    );
  }

  // 4) check if user account is inactive
  if (currentUser.status === 'inactive' && currentUser.role !== 'patient') {
    return next(
      new AppError('Your account is inactive. Return to Admin to activate it')
    );
  }

  // 5) Check if user changed password after the token was issued
  if (userModel.changedPasswordAfter(currentUser, decoded.iat)) {
    return next(
      new AppError('password has been changed. please login again!', 401)
    );
  }

  // 6) Update last login
  await db.query(`UPDATE users SET last_seen = NOW() WHERE national_id = $1`, [
    currentUser.national_id,
  ]);

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`you do not have permission to perform this action`, 403)
      );
    }
    next();
  };
};

// ===================== CONFIRM ADMIN PASSWORD =====================
export const confirmAdmin = catchAsync(async (req, res, next) => {
  // 1) Get password from request body
  const { password, newAccountPassword } = req.body;

  console.log('password', password);
  console.log('newpassword', newAccountPassword);

  console.log('🔍 Confirm Admin - req.body:', req.body); // Debug log

  if (!password) {
    return next(new AppError('Please provide your password to confirm', 400));
  }

  // 2) Get current user (must be protected route)
  if (!req.user) {
    return next(new AppError('User not found. Please login first', 401));
  }

  // 3) Fetch user password from database
  const result = await db.query(
    'SELECT password FROM users WHERE national_id = $1',
    [req.user.national_id]
  );

  if (result.rows.length === 0) {
    return next(new AppError('User not found', 404));
  }

  const user = result.rows[0];

  // 4) Compare passwords
  const isPasswordCorrect = await userModel.correctPassword(
    password,
    user.password
  );
  console.log('isPasswordCorrect', isPasswordCorrect);

  if (!isPasswordCorrect) {
    return next(new AppError('Incorrect password. Please try again', 401));
  }

  // 5) If password is correct, proceed to next middleware
  // 5) Replace password with new account password for signup
  req.body.password = newAccountPassword;
  req.body.passwordConfirm = newAccountPassword;
  req.body.address = 'Company';

  // Remove the confirmation password so it doesn't interfere
  delete req.body.newAccountPassword;

  next();
});

// ===================== FORGOT PASSWORD =====================
export const forgotPassword = catchAsync(async (req, res, next) => {
  await db.query('BEGIN');

  // 1) Get user
  const { email } = req.body;
  if (!email) return next(new AppError('Please provide your email', 400));

  const qFind = 'SELECT national_id, name, email FROM users WHERE email = $1';
  const { rows } = await db.query(qFind, [email]);
  const user = rows[0];

  if (!user) return next(new AppError('No user with that email.', 404));

  // 2) Generate token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const qUpdate = `
    UPDATE users
    SET passwordresettoken = $1,
        passwordresetexpires = $2,
        updated_at = now()
    WHERE national_id = $3
  `;
  await db.query(qUpdate, [hashedToken, expiresAt, user.national_id]);

  // 3) Now try sending the email BEFORE committing
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
      //)}/api/v1/users/ResetPassword/${resetToken}`;
    )}/DoctorPage/appointments`;
    await new Email(
      user.email,
      user.name.split(' ')[0],
      resetURL
    ).sendPasswordReset();

    // Email sent successfully → commit
    await db.query('COMMIT');
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    // Email failed → undo DB changes
    await db.query('ROLLBACK');

    return next(new AppError('Error sending email. Try again later.', 500));
  }
});

// ===================== RESET PASSWORD =====================
export const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password, passwordConfirm } = req.body;

  validatePassword(password, passwordConfirm);

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const q = `
    SELECT national_id, passwordresetexpires
    FROM users
    WHERE passwordresettoken = $1
  `;
  const { rows } = await db.query(q, [hashedToken]);
  const user = rows[0];

  if (!user || new Date(user.passwordresetexpires) < new Date())
    return next(new AppError('Token invalid or expired', 400));

  const hashedPass = await bcrypt.hash(password, 12);

  const qUpdate = `
    UPDATE users
    SET password = $1,
        passwordresettoken = NULL,
        passwordresetexpires = NULL,
        passwordchangedat = now(),
        updated_at = now()
    WHERE national_id = $2
    RETURNING national_id, name, email, role
  `;
  const { rows: updatedRows } = await db.query(qUpdate, [
    hashedPass,
    user.national_id,
  ]);

  createSendToken(updatedRows[0], 200, req, res);
});

// ===================== UPDATE PASSWORD =====================
export const updatePassword = catchAsync(async (req, res, next) => {
  const userId = req.user.national_id;

  const { passwordCurrent, password, passwordConfirm } = req.body;

  validatePassword(password, passwordConfirm);

  await db.query('BEGIN');

  const qFind =
    'SELECT national_id, password FROM users WHERE national_id = $1';
  const { rows } = await db.query(qFind, [userId]);
  const user = rows[0];

  if (!user) return next(new AppError('User not found', 404));

  const correct = await correctPassword(passwordCurrent, user.password);
  if (!correct) return next(new AppError('Current password incorrect', 401));

  const hashedNew = await bcrypt.hash(password, 12);

  const qUpdate = `
    UPDATE users
    SET password = $1,
        passwordchangedat = now(),
        updated_at = now()
    WHERE national_id = $2
    RETURNING national_id, name, email, role
  `;
  const { rows: updatedRows } = await db.query(qUpdate, [hashedNew, userId]);
  // 🔔
  await pushNotification({
    national_id: updatedRows[0].national_id,
    type: 'system',
    content: `Your password has been updated successfully.`,
  });
  await db.query('COMMIT');
  createSendToken(updatedRows[0], 200, req, res);
});
// ===================== LOGOUT =====================
export const logout = (req, res) => {
  res.cookie('jwt', 'LoggedOut', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
    secure: false,
    // secure: req.secure || req.headers['x-forwarded-proto'] === 'https', -- production
    // sameSite: 'none', -- production
  });

  res.set('Cache-Control', 'no-store');

  res.status(200).json({
    status: 'success',
  });
};
