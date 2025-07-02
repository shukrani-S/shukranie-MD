// 📁 raymond/isOwner.js
const control = require('../control');

function isOwner(m) {
  return m.key.fromMe; // This checks if the sender is the same number that scanned the QR/started the session
}

module.exports = isOwner;
