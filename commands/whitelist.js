// 📁 commands/whitelist.js const db = require('../database/db'); const isAdmin = require('../raymond/isAdmin');

module.exports = { name: 'whitelist', description: 'Allow or disallow a number to send links (no kick).',

async execute(sock, m, args) { if (!await isAdmin(sock, m)) { return await sock.sendMessage(m.key.remoteJid, { text: '🚫 This command is for group admins only.' }, { quoted: m }); }

const rawArg = args[0]?.toLowerCase();
const isRemove = rawArg.startsWith('remove');
const number = isRemove ? rawArg.slice(6).replace(/[^0-9]/g, '') : rawArg.replace(/[^0-9]/g, '');

if (!number || number.length < 9) {
  return await sock.sendMessage(m.key.remoteJid, {
    text: '⚙️ Usage: whitelist <number> or whitelist remove<number>\nExample: whitelist 255615184672\nTo remove: whitelist remove255615184672'
  }, { quoted: m });
}

const jid = number + '@s.whatsapp.net';

if (isRemove) {
  await db.query('DELETE FROM whitelist WHERE jid = $1', [jid]);
  await sock.sendMessage(m.key.remoteJid, {
    react: { text: '😈', key: m.key }
  });
  await sock.sendMessage(m.key.remoteJid, {
    text: `❌ ${number} has been removed from the whitelist. Links will be blocked.\nPower by SHUKRANI`
  }, { quoted: m });
} else {
  await db.query('INSERT INTO whitelist (jid) VALUES ($1) ON CONFLICT (jid) DO NOTHING', [jid]);
  await sock.sendMessage(m.key.remoteJid, {
    react: { text: '😈', key: m.key }
  });
  await sock.sendMessage(m.key.remoteJid, {
    text: `✅ ${number} is now whitelisted. They can send links without being removed.\nPower by SHUKRANI`
  }, { quoted: m });
}

},

async isWhitelisted(jid) { const res = await db.query('SELECT 1 FROM whitelist WHERE jid = $1 LIMIT 1', [jid]); return res.rowCount > 0; } };

    
