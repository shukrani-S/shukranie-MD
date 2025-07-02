// 📁 commands/menu.js

module.exports = { name: 'menu', description: 'Show bot command menu',

async execute(sock, m) { const menu = `SHUKRANI-MD Command Menu

Group Commands vv save vvaudio profile groupicon link

Admin Tagging tagall getallmembers hidetag totalmember

Anti-Link Control antilink [on/off] whitelist [number/remove]

Media & Search play [song name] videoplay [name] playing google [query] sticker stickervideo photo crop

Bot Settings autotyping [yes/no] autorecord [yes/no] alwaysonline [yes/no] autoreacting [yes/no] autorecordtyping [yes/no] settings get settings reset

Danger Zone shukranikill bug

Powered by SHUKRANI-MD`;

await sock.sendMessage(m.key.remoteJid, { text: menu }, { quoted: m });

} };

                                         
