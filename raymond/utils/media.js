// 📁 raymond/utils/media.js

const ytdl = require('ytdl-core'); const ffmpeg = require('fluent-ffmpeg'); const ffmpegPath = require('ffmpeg-static'); const fs = require('fs'); const path = require('path'); const axios = require('axios'); const { Sticker } = require('wa-sticker-formatter');

ffmpeg.setFfmpegPath(ffmpegPath);

// Download YouTube audio async function downloadAudio(query) { const info = await ytdl.getInfo(query); const title = info.videoDetails.title; const stream = ytdl(query, { filter: 'audioonly' });

const outputPath = path.join(__dirname, '../../temp', ${Date.now()}_audio.mp3); await new Promise((resolve, reject) => { ffmpeg(stream) .audioBitrate(128) .save(outputPath) .on('end', resolve) .on('error', reject); });

return { title, filePath: outputPath }; }

// Download YouTube video async function downloadVideo(query) { const info = await ytdl.getInfo(query); const title = info.videoDetails.title; const stream = ytdl(query, { quality: '18' });

const outputPath = path.join(__dirname, '../../temp', ${Date.now()}_video.mp4); await new Promise((resolve, reject) => { ffmpeg(stream) .save(outputPath) .on('end', resolve) .on('error', reject); });

return { title, filePath: outputPath }; }

// Convert image or video to sticker async function mediaToSticker(mediaBuffer, type = 'image') { const sticker = new Sticker(mediaBuffer, { type, pack: 'SHUKRANI-MD', author: 'Raymond', quality: 70 }); return await sticker.toBuffer(); }

// Convert sticker to photo async function stickerToPhoto(stickerBuffer, outPath) { const output = outPath || path.join(__dirname, '../../temp', ${Date.now()}_photo.png);

await fs.promises.writeFile(output, stickerBuffer); return output; }

// Convert animated sticker to video async function stickerToVideo(stickerBuffer, outPath) { const output = outPath || path.join(__dirname, '../../temp', ${Date.now()}_video.mp4); await fs.promises.writeFile(output, stickerBuffer); return output; }

// Crop image or video (basic crop to square center) async function cropMedia(inputPath, outPath) { const output = outPath || path.join(__dirname, '../../temp', ${Date.now()}_cropped.jpg);

await new Promise((resolve, reject) => { ffmpeg(inputPath) .videoFilters('crop=in_h:in_h') .save(output) .on('end', resolve) .on('error', reject); });

return output; }

module.exports = { downloadAudio, downloadVideo, mediaToSticker, stickerToPhoto, stickerToVideo, cropMedia };

                                                          
