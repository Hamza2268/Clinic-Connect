import cron from 'node-cron';
import db from '../db.js';

cron.schedule('* * * * *', async () => {
  const now = new Date();

  const result = await db.query(
    `SELECT appointment_id, date, start_hour, end_hour, status 
     FROM appointments 
     WHERE status IN ('upcoming', 'in-progress')`
  );

  for (const app of result.rows) {
    const start = new Date(`${app.date}T${app.start_hour}`);
    const end = new Date(`${app.date}T${app.end_hour}`);
    const endOfDay = new Date(app.date);
    endOfDay.setHours(23, 59, 59, 999);

    let newStatus = app.status;

    if (now < start) {
      newStatus = 'upcoming';
    } else if (now >= start && now <= end) {
      newStatus = 'in-progress';
    } else if (
      now > endOfDay &&
      app.status !== 'completed' &&
      app.status !== 'cancelled'
    ) {
      newStatus = 'missed';
    }

    if (newStatus !== app.status) {
      await db.query(
        `UPDATE appointments SET status = $1 WHERE appointment_id = $2`,
        [newStatus, app.appointment_id]
      );
      console.log(`Updated appointments ${app.appointment_id} → ${newStatus}`);
    }
  }
});
