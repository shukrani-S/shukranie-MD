// 📁 commands/tags.js

const isAdmin = require('../raymond/isAdmin');

module.exports = { name: 'tags', description: 'Tagging and group member utilities (tagall, getallmembers, hidetag, totalmember)',

async execute(sock, m, args) { const groupId = m.key.remoteJid;

// Allow only group admins
const isGroupAdmin = await isAdmin(sock, m);
if (!isGroupAdmin) {
  return await sock.sendMessage(groupId, {
    text: '❌ This command is for group admins only.'
  }, { quoted: m });
}

const metadata = await sock.groupMetadata(groupId);
const participants = metadata.participants;
const allJids = participants.map(p => p.id);

const command = args[0]?.toLowerCase();
const quotedMessage = m.message?.extendedTextMessage?.contextInfo?.quotedMessage || {};

switch (command) {
  case 'tagall': {
    await sock.sendMessage(groupId, {
      react: { text: '🎉', key: m.key }
    });

    let message = '*👥 Tagging all members:*\n';
    for (let p of participants) {
      message += `@${p.id.split('@')[0]}\n`;
    }

    await sock.sendMessage(groupId, {
      text: message,
      mentions: allJids
    }, { quoted: m });
    break;
  }

  case 'getallmembers': {
    await sock.sendMessage(groupId, {
      react: { text: '😲', key: m.key }
    });

    const links = participants.map(p => `wa.me/${p.id.split('@')[0]}`).join('\n');
    await sock.sendMessage(groupId, { text: '*🌐 Member WhatsApp Links:*\n' + links }, { quoted: m });
    break;
  }

  case 'hidetag': {
    await sock.sendMessage(groupId, {
      react: { text: '🫡', key: m.key }
    });

    const msg = args.slice(1).join(' ') || 'Message to all members.';
    await sock.sendMessage(groupId, {
      text: msg,
      mentions: allJids
    }, { quoted: m });
    break;
  }

  case 'totalmember': {
    await sock.sendMessage(groupId, {
      react: { text: '🥴', key: m.key }
    });

    const total = participants.length;
    const presences = await sock.presenceSubscribe(groupId);
    const onlineCount = Object.values(sock.store.presences[groupId] || {}).filter(p => p.lastSeen).length;

    await sock.sendMessage(groupId, {
      text: `👥 Total members: ${total}\n🟢 Currently online: ${onlineCount}`
    }, { quoted: m });
    break;
  }

  default:
    await sock.sendMessage(groupId, {
      text: '❌ Invalid sub-command. Use one of: tagall, getallmembers, hidetag, totalmember'
    }, { quoted: m });
}

} };

