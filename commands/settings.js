// 📁 commands/settings.js
const { getSetting, setSetting } = require('../database/settings');

module.exports = {
  name: 'settings',
  description: 'Toggle or view settings. Usage: autotyping yes | settings get',

  async execute(sock, m, args) {
    const setting = args[0]?.toLowerCase();
    const value = args[1]?.toLowerCase();

    // ⬇️ View all settings
    if (setting === 'get') {
      const settingsList = [
        'autotyping',
        'autorecord',
        'alwaysonline',
        'autoreacting',
        'autorecordtyping',
        'prefix',
        'commands_mode'
      ];

      let output = '📊 *Current Settings:*\n';

      for (const key of settingsList) {
        const val = await getSetting(key) || 'not set';
        output += `• ${key}: ${val}\n`;
      }

      return await sock.sendMessage(m.key.remoteJid, {
        text: output.trim()
      }, { quoted: m });
    }

    // ⬇️ Toggle setting
    if (
      !['yes', 'no'].includes(value) ||
      !['autotyping', 'autorecord', 'alwaysonline', 'autoreacting', 'autorecordtyping'].includes(setting)
    ) {
      return await sock.sendMessage(m.key.remoteJid, {
        text: '❌ Invalid input.\n\n✅ Usage:\n• autotyping yes\n• autorecord no\n• settings get'
      }, { quoted: m });
    }

    await setSetting(setting, value);

    const reactions = {
      'autotyping': '🔥',
      'autorecord': '😀',
      'alwaysonline': '🤭',
      'autoreacting': '🥰',
      'autorecordtyping': '✊'
    };

    const response = value === 'yes'
      ? `✅ ${setting.charAt(0).toUpperCase() + setting.slice(1)} is now ENABLED.`
      : `🚫 ${setting.charAt(0).toUpperCase() + setting.slice(1)} is now DISABLED.`;

    await sock.sendMessage(m.key.remoteJid, {
      react: { text: reactions[setting], key: m.key }
    });

    await sock.sendMessage(m.key.remoteJid, { text: response }, { quoted: m });
  }
};
