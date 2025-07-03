// 📁 raymond/cleaner/cleanTemp.js
const fs = require('fs-extra');
const path = require('path');

const tempDir = path.join(__dirname, '../../temp');

async function cleanTemp() {
  try {
    const files = await fs.readdir(tempDir);
    for (const file of files) {
      const filePath = path.join(tempDir, file);
      await fs.remove(filePath);
    }
    console.log(`[⏰] Temp folder cleaned at ${new Date().toLocaleTimeString()}`);
  } catch (err) {
    console.error('❌ Error cleaning temp folder:', err);
  }
}

module.exports = cleanTemp;
