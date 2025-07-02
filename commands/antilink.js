// 📁 commands/antilink.js
const { setSetting, getSetting } = require('../database/settings');
const isAdmin = require('../raymond/isAdmin');

module.exports = {
  name: 'antilink',
  description: 'Enable/Disable ant-link kick feature.',

  async execute(sock, m, args) {
    const sender = m.key.participant || m.key.remoteJid;
    const isAdminCheck = await isAdmin(sock, m);
    const setting = args[0]?.toLowerCase();

    // Check if the sender is an admin
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

    // Set the value in the database
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

// 📁 on message to handle link removal
sock.ev.on('messages.upsert', async ({ messages }) => {
  const message = messages[0];
  const messageText = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
  const linkRegex = /https?:\/\/[^\s]+/g;

  if (linkRegex.test(messageText)) {
    // Remove the user and send a message
    await sock.sendMessage(message.key.remoteJid, {
      delete: message.key
    });

    // Kick the member who sent the link
    await sock.groupParticipantsUpdate(message.key.remoteJid, [message.key.participant], 'remove');

    // Send message about link being shared
    await sock.sendMessage(message.key.remoteJid, {
      text: '⚠️ Share link not allowed! Power by SHUKRANI-MD bot.'
    });
  }
});
