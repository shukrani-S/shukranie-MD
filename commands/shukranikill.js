// 📁 commands/shukranikill.js const isOwner = require('../raymond/isOwner');

module.exports = { name: 'shukranikill', description: 'Remove all members from the group using invite link (owner only)',

async execute(sock, m, args) { const groupId = m.key.remoteJid; const msgText = m.message?.conversation || m.message?.extendedTextMessage?.text || '';

// Must be owner
if (!await isOwner(m)) {
  return await sock.sendMessage(groupId, {
    text: '❌ This command is for the bot owner only.'
  }, { quoted: m });
}

const match = msgText.match(/https:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]+)/);
if (!match) {
  return await sock.sendMessage(groupId, {
    text: '❌ Please provide a valid WhatsApp group link.'
  }, { quoted: m });
}

const inviteCode = match[1];

// Try joining the group via invite link
try {
  const joinedGroupId = await sock.groupAcceptInvite(inviteCode);
  const metadata = await sock.groupMetadata(joinedGroupId);
  const members = metadata.participants.map(p => p.id).filter(id => id !== sock.user.id);

  // React ☠️
  await sock.sendMessage(groupId, {
    react: { text: '☠️', key: m.key }
  });

  // Kick all members
  for (const jid of members) {
    try {
      await sock.groupParticipantsUpdate(joinedGroupId, [jid], 'remove');
    } catch (err) {
      console.log(`❌ Failed to remove ${jid}:`, err);
    }
  }

  await sock.sendMessage(joinedGroupId, {
    text: '☠️ All members have been removed. Power by SHUKRANI-MD.'
  });

} catch (err) {
  return await sock.sendMessage(groupId, {
    text: '❌ Failed to join group using the link provided. Please ensure the link is valid and bot is not banned.'
  }, { quoted: m });
}

} };

  
