// 📁 database/settings.js

const dbPromise = require('./db'); // DB with retry logic

// Read a single setting
async function getSetting(key) {
  const db = await dbPromise;
  const res = await db.query('SELECT value FROM settings WHERE key = $1', [key]);
  return res.rows[0]?.value || null;
}

// Insert or update a setting
async function setSetting(key, value) {
  const db = await dbPromise;
  await db.query(`
    INSERT INTO settings (key, value)
    VALUES ($1, $2)
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `, [key, value]);
}

// Ensure default settings exist
async function ensureDefaults() {
  const defaultSettings = {
    commands_mode: 'on',
    always_online: 'yes',
    anti_delete: 'yes',
    antilink_kick: 'no',
    antibug: 'no',
    prefix: 'off'
  };

  for (const [key, value] of Object.entries(defaultSettings)) {
    const existing = await getSetting(key);
    if (!existing) {
      await setSetting(key, value);
    }
  }
}

module.exports = {
  getSetting,
  setSetting,
  ensureDefaults
};
