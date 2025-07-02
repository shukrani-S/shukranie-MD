// 📁 commands/search.js const fs = require('fs'); const path = require('path'); const axios = require('axios'); const { downloadAudio, downloadVideo, mediaToSticker, cropMedia, stickerToPhoto, stickerToVideo } = require('../raymond/player/media');

module.exports = { name: 'search', description: 'Handle search-based media commands like play, sticker, google, crop, etc.',

async execute(sock, m, args) { const command = args[0]?.toLowerCase(); const input = args.slice(1).join(' '); const from = m.key.remoteJid;

switch (command) {
  case 'play': {
    if (!input) return await sock.sendMessage(from, { text: 'Enter song title or YouTube link.' }, { quoted: m });
    const { title, filePath } = await downloadAudio(input);
    await sock.sendMessage(from, { react: { text: '🥳', key: m.key } });
    await sock.sendMessage(from, { text: `🎵 Now playing: *${title}*` });
    await sock.sendMessage(from, { audio: fs.readFileSync(filePath), mimetype: 'audio/mp4' }, { quoted: m });
    fs.unlinkSync(filePath);
    break;
  }

  case 'videoplay': {
    if (!input) return await sock.sendMessage(from, { text: 'Enter video title or YouTube link.' }, { quoted: m });
    const { title, filePath } = await downloadVideo(input);
    await sock.sendMessage(from, { react: { text: '🤔', key: m.key } });
    await sock.sendMessage(from, { video: fs.readFileSync(filePath), caption: `🎬 ${title}` }, { quoted: m });
    fs.unlinkSync(filePath);
    break;
  }

  case 'sticker': {
    const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted) return await sock.sendMessage(from, { text: 'Reply to image/video to convert to sticker.' }, { quoted: m });
    const type = quoted.imageMessage ? 'image' : quoted.videoMessage ? 'video' : null;
    if (!type) return await sock.sendMessage(from, { text: 'Only image/video supported.' }, { quoted: m });
    const media = await sock.downloadMediaMessage({ message: quoted });
    const sticker = await mediaToSticker(media, type);
    await sock.sendMessage(from, { sticker }, { quoted: m });
    await sock.sendMessage(from, { react: { text: '👀', key: m.key } });
    break;
  }

  case 'photo': {
    const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage;
    if (!quoted) return await sock.sendMessage(from, { text: 'Reply to sticker to convert to photo.' }, { quoted: m });
    const media = await sock.downloadMediaMessage({ message: quoted });
    const filePath = await stickerToPhoto(media);
    await sock.sendMessage(from, { image: fs.readFileSync(filePath), caption: '🫣 Converted from sticker' }, { quoted: m });
    fs.unlinkSync(filePath);
    await sock.sendMessage(from, { react: { text: '🫣', key: m.key } });
    break;
  }

  case 'stickervideo': {
    const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage;
    if (!quoted) return await sock.sendMessage(from, { text: 'Reply to animated sticker to convert to video.' }, { quoted: m });
    const media = await sock.downloadMediaMessage({ message: quoted });
    const filePath = await stickerToVideo(media);
    await sock.sendMessage(from, { video: fs.readFileSync(filePath), caption: '🎥 Converted from sticker' }, { quoted: m });
    fs.unlinkSync(filePath);
    await sock.sendMessage(from, { react: { text: '🤔', key: m.key } });
    break;
  }

  case 'crop': {
    const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted) return await sock.sendMessage(from, { text: 'Reply to image/video to crop.' }, { quoted: m });
    const media = await sock.downloadMediaMessage({ message: quoted });
    const inputPath = path.join(__dirname, `../../temp/${Date.now()}_input.jpg`);
    fs.writeFileSync(inputPath, media);
    const outputPath = await cropMedia(inputPath);
    await sock.sendMessage(from, { image: fs.readFileSync(outputPath), caption: '✂️ Cropped media' }, { quoted: m });
    await sock.sendMessage(from, { react: { text: '✂️', key: m.key } });
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);
    break;
  }

  case 'google': {
    if (!input) return await sock.sendMessage(from, { text: 'Type what you want to search on Google.' }, { quoted: m });
    await sock.sendMessage(from, { react: { text: '🙅', key: m.key } });
    await sock.sendMessage(from, { text: `🔎 Searching Google for: *${input}*\nhttps://www.google.com/search?q=${encodeURIComponent(input)}` }, { quoted: m });
    break;
  }

  case 'playing': {
    await sock.sendMessage(from, { text: '🎶 Analyzing audio... (coming soon)' }, { quoted: m });
    await sock.sendMessage(from, { react: { text: '😶‍🌫️', key: m.key } });
    break;
  }

  default:
    await sock.sendMessage(from, { text: '❌ Unknown search command.' }, { quoted: m });
}

} };

