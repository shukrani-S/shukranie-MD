const { getSetting, setSetting } = require('../database/settings');

module.exports = {
  name: 'prefix',
  description: 'Enable or disable prefix mode. Use: prefix-yes or prefix-off',

  async execute(sock, m, args) {
    const input = args[0]?.toLowerCase();

    if (!['yes', 'off'].includes(input)) {
      return await sock.sendMessage(m.key.remoteJid, {
        text: '❌ Invalid option. Please use: prefix-yes or prefix-off\n\n✅ Example:\n> prefix-yes  → enables command prefix (e.g., .menu)\n> prefix-off  → disables prefix, use commands directly (e.g., menu)'
      }, { quoted: m });
    }

    await setSetting('prefix', input);

    await sock.sendMessage(m.key.remoteJid, {
      react: { text: '✊', key: m.key }
    });

    const confirmation = input === 'yes'
      ? '✅ Prefix mode enabled successfully. Use commands like `.menu`, `.play`, etc.'
      : '🚫 Prefix mode disabled. Now you can use commands directly, like `menu`, `play`, etc.';

    await sock.sendMessage(m.key.remoteJid, { text: confirmation }, { quoted: m });
  }
};
