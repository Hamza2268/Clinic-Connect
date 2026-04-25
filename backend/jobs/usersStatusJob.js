import cron from 'node-cron';
import db from '../db.js';

cron.schedule('* * * * *', async () => {
  await db.query(`
    UPDATE users
    SET status = 'inactive'
    WHERE status = 'active'
      AND last_seen < NOW() - INTERVAL '7 days'
  `);
});
