// 📁 commands/repo.js

module.exports = { name: 'repo', description: 'Show bot source code repository',

async execute(sock, m) { const text = ` 📦 SHUKRANI-MD Repository

🔗 GitHub: https://github.com/shukrani-S/shukranie-MD.git

Feel free to fork, contribute, or star ⭐ Powered by SHUKRANI-MD 🚀 `;

await sock.sendMessage(m.key.remoteJid, { text }, { quoted: m });

} };

