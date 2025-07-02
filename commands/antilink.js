// 📁 commands/antilinkwarn.js const { setSetting, getSetting } = require('../database/settings'); const isAdmin = require('../raymond/isAdmin');

module.exports = { name: 'antilinkwarn', description: 'Enable or disable link warning system (before kicking).',

async execute(sock, m, args) { const setting = args[0]?.toLowerCase();

if (!await isAdmin(sock, m)) {
  return await sock.sendMessage(m.key.remoteJid, {
    text: '🚫 This command is for group admins only.'
  }, { quoted: m });
}

if (!['on', 'off'].includes(setting)) {
  return await sock.sendMessage(m.key.remoteJid, {
    text: '⚙️ Usage: antilinkwarn on | antilinkwarn off'
  }, { quoted: m });
}

await setSetting('antilinkwarn', setting);
await setSetting('antilinkwarn_count', '2'); // default warn limit = 2

const react = setting === 'on' ? '⚠️' : '✅';
const text = setting === 'on'
  ? '🚨 Anti-link warning system ENABLED. User will be warned twice before being removed.'
  : '🛑 Anti-link warning system DISABLED. Users will be removed immediately when sending links.';

await sock.sendMessage(m.key.remoteJid, {
  react: { text: react, key: m.key }
});

await sock.sendMessage(m.key.remoteJid, {
  text
}, { quoted: m });

} };

  
