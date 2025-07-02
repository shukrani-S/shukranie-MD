// 📁 raymond/player/media.js const fs = require('fs'); const path = require('path'); const ffmpeg = require('fluent-ffmpeg'); const { writeFile } = require('fs/promises'); const { fromBuffer } = require('file-type'); const { createSticker } = require('wa-sticker-formatter'); const ytdl = require('ytdl-core');

const tempDir = path.join(__dirname, '../../temp'); if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

async function downloadAudio(query) { const info = await ytdl.getInfo(query); const title = info.videoDetails.title; const id = info.videoDetails.videoId; const outputPath = path.join(tempDir, ${id}.mp3);

await new Promise((resolve, reject) => { ytdl.downloadFromInfo(info, { filter: 'audioonly' }) .pipe(fs.createWriteStream(outputPath)) .on('finish', resolve) .on('error', reject); });

return { title, filePath: outputPath }; }

async function downloadVideo(query) { const info = await ytdl.getInfo(query); const title = info.videoDetails.title; const id = info.videoDetails.videoId; const outputPath = path.join(tempDir, ${id}.mp4);

await new Promise((resolve, reject) => { ytdl.downloadFromInfo(info, { filter: 'audioandvideo' }) .pipe(fs.createWriteStream(outputPath)) .on('finish', resolve) .on('error', reject); });

return { title, filePath: outputPath }; }

async function mediaToSticker(mediaBuffer, type = 'image') { const sticker = await createSticker(mediaBuffer, { type: 'full', quality: 100, author: 'SHUKRANI', pack: 'MD-BOT', crop: true }); return sticker; }

async function cropMedia(inputPath) { const outputPath = path.join(tempDir, ${Date.now()}_cropped.jpg);

return new Promise((resolve, reject) => { ffmpeg(inputPath) .outputOptions('-vf', 'crop=in_w/2:in_h/2') .save(outputPath) .on('end', () => resolve(outputPath)) .on('error', reject); }); }

async function stickerToPhoto(buffer) { const type = await fromBuffer(buffer); const filePath = path.join(tempDir, ${Date.now()}.${type.ext}); await writeFile(filePath, buffer); return filePath; }

async function stickerToVideo(buffer) { const type = await fromBuffer(buffer); const stickerPath = path.join(tempDir, ${Date.now()}.${type.ext}); const outputPath = stickerPath.replace(/.[^.]+$/, '.mp4'); await writeFile(stickerPath, buffer);

return new Promise((resolve, reject) => { ffmpeg(stickerPath) .outputOptions('-movflags', 'faststart') .save(outputPath) .on('end', () => resolve(outputPath)) .on('error', reject); }); }

module.exports = { downloadAudio, downloadVideo, mediaToSticker, cropMedia, stickerToPhoto, stickerToVideo };

