import bcryptjs from 'bcryptjs';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const validatePassword = (password, passwordConfirm) => {
  if (password !== passwordConfirm) {
    throw new AppError('Passwords do not match');
  }
};

export const correctPassword = async (candidatePassword, userPassword) => {
  return await bcryptjs.compare(candidatePassword, userPassword);
};

export const hashPassword = catchAsync(async (req, res, next) => {
  console.log(req.body.password);
  if (!req.body.password) return next();
  validatePassword(req.body.password, req.body.passwordConfirm);
  req.body.password = await bcryptjs.hash(req.body.password, 10);

  delete req.body.passwordConfirm;

  return next();
});

export const changedPasswordAfter = (currentUser, JWTTimestamp) => {
  if (currentUser.passwordchangedat) {
    const changedTimestamp = parseInt(
      currentUser.passwordchangedat.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};
