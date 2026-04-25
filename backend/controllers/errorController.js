import AppError from '../utils/appError.js';

// ---------- Handlers for PostgreSQL ----------
const handleDuplicateKeyDB = (err) => {
  // code 23505 = unique violation
  const value = err.detail
    ? err.detail.match(/\(([^)]+)\)/)[1]
    : 'duplicate value';
  return new AppError(
    `Duplicate field value: ${value}. Please use another one!`,
    400
  );
};

const handleCheckConstraintDB = (err) => {
  // code 23514 = check constraint violation
  return new AppError(`Check constraint violated: ${err.constraint}`, 400);
};

const handleForeignKeyDB = (err) => {
  // code 23503 = foreign key violation
  return new AppError(`Foreign key violation: ${err.detail}`, 400);
};

const handleNotNullDB = (err) => {
  // code 23502 = not-null violation
  return new AppError(`Missing required field: ${err.column}`, 400);
};

const handleInvalidTextRepresentation = (err) => {
  // code 22P02 = invalid input syntax
  return new AppError(`Invalid input syntax: ${err.message}`, 400);
};

// ---------- JWT Errors ----------
const handleJWTError = () =>
  new AppError('Invalid token. Please login again!', 401);
const handleJWTExpiredError = () => new AppError('Your token has expired', 401);

// ---------- Send Errors ----------
const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.error('ERROR 💥', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
  console.error('ERROR 💥', err);
  return res.status(500).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later.',
  });
};

// ---------- Global Error Handler ----------
export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // PostgreSQL errors
    if (err.code === '23505') error = handleDuplicateKeyDB(err);
    if (err.code === '23514') error = handleCheckConstraintDB(err);
    if (err.code === '23503') error = handleForeignKeyDB(err);
    if (err.code === '23502') error = handleNotNullDB(err);
    if (err.code === '22P02') error = handleInvalidTextRepresentation(err);
    if (err.code === 'P0001') error = new AppError(err.message, 400);

    // JWT errors
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
