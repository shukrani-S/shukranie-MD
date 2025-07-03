// 📁 commands/antilink.js
const { setSetting, getSetting } = require('../database/settings');
const isAdmin = require('../raymond/isAdmin');

module.exports = {
  name: 'antilink',
  description: 'Enable/Disable anti-link kick feature.',

  async execute(sock, m, args) {
    const setting = args[0]?.toLowerCase();
    const isAdminCheck = await isAdmin(sock, m);

    if (!isAdminCheck) {
      return await sock.sendMessage(m.key.remoteJid, {
        text: '🚫 This command is for group admins only.'
      }, { quoted: m });
    }

    if (!['on', 'off'].includes(setting)) {
      return await sock.sendMessage(m.key.remoteJid, {
        text: '⚙️ Usage: antilink on | antilink off'
      }, { quoted: m });
    }

    await setSetting('antilink', setting);

    const reactions = {
      on: '👿',
      off: '😇'
    };

    const response = setting === 'on'
      ? '✅ Anti-link kick feature ENABLED. Links will be removed and users kicked immediately.'
      : '🚫 Anti-link kick feature DISABLED. No more link removals.';

    await sock.sendMessage(m.key.remoteJid, {
      react: { text: reactions[setting], key: m.key }
    });

    await sock.sendMessage(m.key.remoteJid, {
      text: response
    }, { quoted: m });
  }
};
