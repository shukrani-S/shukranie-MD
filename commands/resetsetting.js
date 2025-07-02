// 📁 commands/resetsettings.js const { setSetting } = require('../database/settings');

module.exports = { name: 'resetsettings', description: 'Restore all settings to default values',

async execute(sock, m) { const defaultSettings = { autotyping: 'no', autorecord: 'no', alwaysonline: 'yes', autoreacting: 'no', autorecordtyping: 'no', prefix: 'no', commands_mode: 'on' };

for (const [key, value] of Object.entries(defaultSettings)) {
  await setSetting(key, value);
}

await sock.sendMessage(m.key.remoteJid, {
  text: '🔁 All settings have been reset to default values.'
}, { quoted: m });

} };

  
