// 📁 commands/group.js

const isAdmin = require('../raymond/isAdmin'); const isOwner = require('../raymond/isOwner'); const fs = require('fs'); const path = require('path');

module.exports = { name: 'group', description: 'Group tools including vv, save, profile, groupicon, etc.',

async execute(sock, m, args) { const command = args[0]?.toLowerCase(); const groupId = m.key.remoteJid; const sender = m.key.participant || m.key.remoteJid; const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;

switch (command) {
  case 'vv': {
    await sock.sendMessage(groupId, {
      react: { text: '🖐️', key: m.key }
    });

    if (!quoted?.viewOnceMessage?.message) return await sock.sendMessage(groupId, { text: '❌ Reply to a view once message.' }, { quoted: m });

    const normalMsg = quoted.viewOnceMessage.message;
    await sock.sendMessage(groupId, normalMsg, { quoted: m });
    break;
  }

  case 'save': {
    await sock.sendMessage(groupId, {
      react: { text: '🥰', key: m.key }
    });

    if (!quoted?.viewOnceMessage?.message) return await sock.sendMessage(groupId, { text: '❌ Reply to a view once message.' }, { quoted: m });

    const inbox = sender;
    const msg = quoted.viewOnceMessage.message;
    await sock.sendMessage(inbox, msg);
    await sock.sendMessage(groupId, { text: '✅ Saved to inbox.' }, { quoted: m });
    break;
  }

  case 'vvaudio':
  case 'saveaudio': {
    await sock.sendMessage(groupId, {
      react: { text: '😂', key: m.key }
    });

    if (!quoted?.viewOnceMessage?.message?.audioMessage) return await sock.sendMessage(groupId, { text: '❌ Reply to a view once audio.' }, { quoted: m });

    const msg = quoted.viewOnceMessage.message;
    if (command === 'vvaudio') {
      await sock.sendMessage(groupId, msg, { quoted: m });
    } else {
      await sock.sendMessage(sender, msg);
      await sock.sendMessage(groupId, { text: '✅ Audio saved to inbox.' }, { quoted: m });
    }
    break;
  }

  case 'profile': {
    await sock.sendMessage(groupId, {
      react: { text: '😊', key: m.key }
    });

    const user = quoted?.participant || sender;
    const ppUrl = await sock.profilePictureUrl(user, 'image').catch(() => null);
    if (!ppUrl) return await sock.sendMessage(groupId, { text: '❌ No profile picture.' }, { quoted: m });

    await sock.sendMessage(groupId, { image: { url: ppUrl }, caption: '👤 Profile picture' }, { quoted: m });
    break;
  }

  case 'groupicon': {
    await sock.sendMessage(groupId, {
      react: { text: '🫡', key: m.key }
    });

    const img = await sock.profilePictureUrl(groupId, 'image').catch(() => null);
    if (!img) return await sock.sendMessage(groupId, { text: '❌ Group has no icon.' }, { quoted: m });

    await sock.sendMessage(groupId, { image: { url: img }, caption: '🖼️ Group Icon' }, { quoted: m });
    break;
  }

  case 'link': {
    await sock.sendMessage(groupId, {
      react: { text: '💢', key: m.key }
    });

    try {
      const code = await sock.groupInviteCode(groupId);
      await sock.sendMessage(groupId, { text: `🔗 Group Link: https://chat.whatsapp.com/${code}` }, { quoted: m });
    } catch {
      await sock.sendMessage(groupId, { text: '❌ Failed to retrieve group link.' }, { quoted: m });
    }
    break;
  }

  default:
    await sock.sendMessage(groupId, {
      text: '❌ Unknown command. Try: vv, save, vvaudio, saveaudio, profile, groupicon, link.'
    }, { quoted: m });
}

} };

      
