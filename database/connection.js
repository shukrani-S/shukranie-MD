const { Sequelize } = require('sequelize');

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 5000; // 5 seconds

async function createConnectionWithRetry(retries = MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      const sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      });

      await sequelize.authenticate();
      console.log('✅ PostgreSQL connected successfully.');
      return sequelize;
    } catch (err) {
      console.error(`🔁 PostgreSQL connection failed (attempt ${i + 1}/${retries}):`, err.message);
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
      } else {
        console.error('❌ All retry attempts failed. Exiting...');
        process.exit(1);
      }
    }
  }
}

module.exports = createConnectionWithRetry();
