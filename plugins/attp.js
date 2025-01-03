const axios = require("axios");
const config = require("../config");
const { Sticker, createSticker, StickerTypes } = require("wa-sticker-formatter");
const { cmd, commands } = require("../command");
const {
  getBuffer,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  runtime,
  sleep,
  fetchJson
} = require("../lib/functions");
const path = require("path");
const { tmpdir } = require("os");
const fetch = require("node-fetch");
const Crypto = require("crypto");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");

ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Converts a video buffer to a WebP sticker format.
 * @param {Buffer} videoBuffer - The video buffer to convert.
 * @returns {Buffer} - The converted WebP sticker buffer.
 */
async function videoToWebp(videoBuffer) {
  const outputPath = path.join(
    tmpdir(),
    Crypto.randomBytes(6).readUIntLE(0, 6).toString(36) + ".webp"
  );
  const inputPath = path.join(
    tmpdir(),
    Crypto.randomBytes(6).readUIntLE(0, 6).toString(36) + ".mp4"
  );

  fs.writeFileSync(inputPath, videoBuffer);

  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .on("error", reject)
      .on("end", () => resolve(true))
      .addOutputOptions([
        "-vcodec", "libwebp",
        "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0,split [a][b];[a] palettegen=reserve_transparent=on:transparency_color=ffffff [p];[b][p] paletteuse",
        "-loop", "0",
        "-ss", "00:00:00",
        "-t", "00:00:05",
        "-preset", "default",
        "-an",
        "-vsync", "0"
      ])
      .toFormat("webp")
      .save(outputPath);
  });

  const webpBuffer = fs.readFileSync(outputPath);
  fs.unlinkSync(outputPath);
  fs.unlinkSync(inputPath);

  return webpBuffer;
}

/**
 * Converts a video buffer to an audio MP3 buffer.
 * @param {Buffer} videoBuffer - The video buffer to convert.
 * @param {string} outputPath - The path to save the MP3 file.
 * @returns {Buffer} - The converted MP3 buffer.
 */
function toAudio(videoBuffer, outputPath) {
  return ffmpeg(videoBuffer, [
    "-vn",
    "-ac", "2",
    "-b:a", "128k",
    "-ar", "44100",
    "-f", "mp3"
  ], outputPath, "mp3");
}

/**
 * Converts a video buffer to an audio PTT (Opus) buffer.
 * @param {Buffer} videoBuffer - The video buffer to convert.
 * @param {string} outputPath - The path to save the Opus file.
 * @returns {Buffer} - The converted Opus buffer.
 */
function toPTT(videoBuffer, outputPath) {
  return ffmpeg(videoBuffer, [
    "-vn",
    "-c:a", "libopus",
    "-b:a", "128k",
    "-vbr", "on",
    "-compression_level", "10"
  ], outputPath, "opus");
}

/**
 * Converts a video buffer to an MP4 video buffer.
 * @param {Buffer} videoBuffer - The video buffer to convert.
 * @param {string} outputPath - The path to save the MP4 file.
 * @returns {Buffer} - The converted MP4 video buffer.
 */
function toVideo(videoBuffer, outputPath) {
  return ffmpeg(videoBuffer, [
    "-c:v", "libx264",
    "-c:a", "aac",
    "-ab", "128k",
    "-ar", "44100",
    "-crf", "32",
    "-preset", "slow"
  ], outputPath, "mp4");
}

module.exports = {
  videoToWebp,
  toAudio,
  toPTT,
  toVideo
};  




// attp

const { cmd } = require('../command');

cmd({
    pattern: "attp",
    desc: "Convert text to a GIF sticker.",
    react: "✨",
    category: "convert",
    use: ".attp HI",
    filename: __filename,
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!args[0]) {
            return reply("*Please give me a text!*");
        }

        let buffer = await getBuffer(`https://api-fix.onrender.com/api/maker/attp?text=${args[0]}`);
        const replyOptions = {
            quoted: m
        };
        await conn.sendMessage(m.chat, {
            'sticker': await videoToWebp(buffer)
        }, replyOptions);
    } catch (e) {
        console.error("Error:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});



cmd({
    pattern: "mp3",
    react: '🔊',
    alias: ["toaudio", "tomp3"],
    desc: "Convert video to audio.",
    category: "convert",
    use: ".tomp3 <Reply to a video>",
    filename: __filename,
}, async (conn, mek, m, { from, quoted, reply }) => {
    try {
        const isVideo = quoted && quoted.type === "videoMessage";
        if (!isVideo) {
            return reply("❗ Please reply to a video message.");
        }

        const videoBuffer = await quoted.download();
        const audioBuffer = await ffmpeg(videoBuffer, [
            "-vn",  // Exclude video
            "-c:a", "libopus",
            "-b:a", "128k",
            "-vbr", "on",
            "-compression_level", "10"
        ], "mp4", "opus");

        await conn.sendMessage(from, {
            audio: audioBuffer,
            mimetype: "audio/mpeg"
        }, { quoted: m });

    } catch (error) {
        console.error("Error:", error);
        reply(`❌ An error occurred: ${error.message}`);
    }
});

// fancy2

cmd({
    pattern: "fancytext2",
    alias: ["fancy2", "textstyle2"],
    desc: "Convert text to fancy styles using an API.",
    use: ".fancy <text>",
    category: "search",
    react: "🎨",
    filename: __filename,
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!args[0]) {
            return reply("❗ Please provide text to style.\n\nExample: .fancytext <your-text>");
        }

        const encodedText = encodeURIComponent(args.join(" ").trim());
        const apiUrl = `https://api.giftedtechnexus.co.ke/api/tools/fancy?text=${encodedText}&apikey=ibrahimtech_ai`;
        reply("⏳ Generating fancy text... Please wait.");
        
        const response = await axios.get(apiUrl);
        if (response.status === 200 && response.data && response.data.results) {
            let resultText = "🎨 Fancy Text Styles:\n\n";
            response.data.results.forEach((item, index) => {
                resultText += `${index + 1}. ${item.result}\n\n`;
            });
            const replyOptions = {
                text: resultText
            };
            await conn.sendMessage(m.chat, replyOptions, { quoted: m });
        } else {
            reply("❗ Failed to generate fancy text. Please try again later.");
        }
    } catch (e) {
        console.error("Error:", e);
        reply("❗ An error occurred while generating the fancy text.");
    }
}); 
