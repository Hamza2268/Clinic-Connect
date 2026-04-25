import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const client = new pg.Client({
  connectionString: DB,
  ssl: { rejectUnauthorized: false },
});

client
  .connect()
  .then(() => console.log('Connected to Neon PostgreSQL'))
  .catch((err) => console.error('DB connection error:', err));

export default client;
