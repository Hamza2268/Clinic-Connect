import db from '../db.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// ================= GET SCHEDULE =================
export const getSchedule = catchAsync(async (req, res, next) => {
  const userID = req.user.national_id;
  /*
    shift_schedule table schema:
    doctor_id | weekday | start_hour | end_hour
  */
  const query = `
    SELECT
      weekday,
      start_hour,
      end_hour
    FROM Shift_Schedule
    WHERE doctor_id = $1
    ORDER BY
      CASE
        WHEN weekday = 'Monday' THEN 1
        WHEN weekday = 'Tuesday' THEN 2
        WHEN weekday = 'Wednesday' THEN 3
        WHEN weekday = 'Thursday' THEN 4
        WHEN weekday = 'Friday' THEN 5
        WHEN weekday = 'Saturday' THEN 6
        WHEN weekday = 'Sunday' THEN 7
      END;
  `;

  const { rows } = await db.query(query, [userID]);

  // ================= PROCESS SCHEDULE =================
  let totalWeeklyHours = 0;
  let workingDaysCount = 0;

  const schedule = rows.map((row) => {
    const start = row.start_hour;
    const end = row.end_hour;

    let duration = 0;
    let status = 'off';

    if (start && end) {
      /*    calculate duration in hours
      JavaScript cannot subtract times directly, so we:
      Attach the time to a fake date (1970-01-01)
      */
      const startTime = new Date(`1970-01-01T${start}`);
      const endTime = new Date(`1970-01-01T${end}`);
      duration = (endTime - startTime) / (1000 * 60 * 60);

      if (duration > 0) {
        status = 'working';
        totalWeeklyHours += duration;
        workingDaysCount += 1;
      }
    }

    return {
      weekday: row.weekday,
      shiftStart: start,
      shiftEnd: end,
      duration,
      status,
    };
  });

  res.status(200).json({
    status: 'success',
    results: schedule.length,
    data: {
      days: schedule,
      totalWeeklyHours,
      workingDays: workingDaysCount,
    },
  });
});
// ================= SET SCHEDULE =================
export const setSchedule = catchAsync(async (req, res, next) => {
  const doctorID = req.user.national_id;

  const { weekday, start_hour, end_hour } = req.body;

  if (!weekday || !start_hour || !end_hour) {
    return next(
      new AppError('weekday, start_hour, and end_hour are required', 400)
    );
  }

  if (start_hour >= end_hour) {
    return next(new AppError('start_hour must be earlier than end_hour', 400));
  }
  // If conflict occurs → update the row instead of inserting a new one
  const insertQ = `
    INSERT INTO Shift_Schedule (doctor_id, weekday, start_hour, end_hour)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (doctor_id, weekday)
    DO UPDATE SET start_hour = EXCLUDED.start_hour,
                  end_hour = EXCLUDED.end_hour
    RETURNING *;
  `;

  const result = (
    await db.query(insertQ, [doctorID, weekday, start_hour, end_hour])
  ).rows[0];

  res.status(201).json({
    status: 'success',
    data: result,
  });
});
// ================= EDIT SCHEDULE =================
export const editSchedule = catchAsync(async (req, res, next) => {
  const doctorID = req.user.national_id;
  const weekday = req.params.weekday;

  const { start_hour, end_hour } = req.body;

  if (!start_hour && !end_hour) {
    return next(
      new AppError('Provide at least one field: start_hour or end_hour', 400)
    );
  }

  const existing = await db.query(
    `SELECT * FROM Shift_Schedule WHERE doctor_id = $1 AND weekday = $2`,
    [doctorID, weekday]
  );

  if (existing.rowCount === 0) {
    return next(new AppError('No schedule found for this weekday', 404));
  }

  const newStart = start_hour || existing.rows[0].start_hour;
  const newEnd = end_hour || existing.rows[0].end_hour;

  if (newStart >= newEnd) {
    return next(new AppError('start_hour must be earlier than end_hour', 400));
  }

  const updateQ = `
    UPDATE Shift_Schedule
    SET start_hour = $1, end_hour = $2
    WHERE doctor_id = $3 AND weekday = $4
    RETURNING *;
  `;

  const updated = (
    await db.query(updateQ, [newStart, newEnd, doctorID, weekday])
  ).rows[0];

  res.status(200).json({
    status: 'success',
    data: updated,
  });
});
// ================= DELETE SCHEDULE =================
export const deleteSchedule = catchAsync(async (req, res, next) => {
  const doctorID = req.user.national_id;
  const weekday = req.params.weekday;

  const del = await db.query(
    `DELETE FROM Shift_Schedule
     WHERE doctor_id = $1 AND weekday = $2
     RETURNING *`,
    [doctorID, weekday]
  );

  if (del.rowCount === 0) {
    return next(new AppError('No schedule found for this weekday', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
