// 📁 raymond/isAdmin.js
async function isAdmin(sock, m) {
  const groupMetadata = await sock.groupMetadata(m.key.remoteJid);
  const groupAdmins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);

  return groupAdmins.includes(m.key.participant);
}

module.exports = isAdmin;
