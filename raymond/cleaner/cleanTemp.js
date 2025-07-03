// 📁 raymond/cleaner/cleanTemp.js
const fs = require('fs');
const path = require('path');

// Path to the temp folder
const tempDir = path.join(__dirname, '../../temp');

// Create the temp folder if it doesn't exist
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

/**
 * Clean all files inside the temp/ directory
 */
function clearTempFolder() {
  fs.readdir(tempDir, (err, files) => {
    if (err) return console.error('❌ Error reading temp folder:', err);
    
    for (const file of files) {
      const filePath = path.join(tempDir, file);
      fs.unlink(filePath, err => {
        if (err) console.error(`❌ Failed to delete ${filePath}:`, err);
      });
    }

    console.log('🧹 Temp folder cleaned successfully!');
  });
}

module.exports = clearTempFolder;
