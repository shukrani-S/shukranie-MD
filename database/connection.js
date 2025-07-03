const { Sequelize } = require('sequelize');

let sequelize;
let connected = false;
let attempt = 0;
const MAX_RETRIES = 10;

async function connectDB() {
  const DB_URL = process.env.DATABASE_URL;

  if (!DB_URL) {
    console.warn("⚠️ DATABASE_URL not set. Skipping DB connection.");
    return null;
  }

  sequelize = new Sequelize(DB_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }
    }
  });

  while (!connected && attempt < MAX_RETRIES) {
    try {
      attempt++;
      await sequelize.authenticate();
      connected = true;
      console.log('✅ Connected to PostgreSQL database.');
    } catch (err) {
      console.error(`🔁 DB connection failed (attempt ${attempt}/${MAX_RETRIES}):`, err.message);
      await new Promise(res => setTimeout(res, 2000));
    }
  }

  if (!connected) {
    console.error('❌ All retry attempts failed. Running in no-DB mode...');
    return null;
  }

  return sequelize;
}

module.exports = connectDB;
