const { Pool } = require('pg');

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 5000;

let pool;

async function connectWithRetry(retries = MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });

      // Test the connection
      await pool.query('SELECT NOW()');
      console.log('✅ Connected to PostgreSQL database.');
      return {
        query: (text, params) => pool.query(text, params)
      };
    } catch (err) {
      console.error(`🔁 DB connection failed (attempt ${i + 1}/${retries}):`, err.message);
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
      } else {
        console.error('❌ All retry attempts failed. Exiting...');
        process.exit(1);
      }
    }
  }
}

module.exports = connectWithRetry();
