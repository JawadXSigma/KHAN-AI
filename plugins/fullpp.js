const { cmd, commands } = require('../command');
const yts = require('yt-search');
const { exec } = require('child_process');

cmd({
    pattern: "play2",
    alias: ["ytmp3", "audio"],
    desc: "Download songs",
    category: "download",
    react: "🎵",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, args, q, reply }) => {
    try {
        if (!q) return reply("*Please provide a link or a name 🔎...*");

        // Search for the song on YouTube
        const search = await yts(q);
        const data = search.videos[0];
        const url = data.url;

        let desc = `╭━━━〔 *KHANX-MD* 〕━━━┈⊷
┃▸ *Title*: ${data.title}
┃▸ *Views*: ${data.views}
┃▸ *Duration*: ${data.timestamp}
┃▸ *Link*: ${data.url}
╰━━━━━━━━━━━━━━━⪼`;
        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        // Download the audio using yt-dlp
        exec(`yt-dlp -x --audio-format mp3 -o "downloaded/%(title)s.%(ext)s" "${url}"`, async (error, stdout, stderr) => {
            if (error) {
                return reply("An error occurred while downloading the audio.");
            }

            const filePath = `downloaded/${data.title}.mp3`;
            await conn.sendMessage(from, { audio: { url: filePath }, mimetype: "audio/mpeg" }, { quoted: mek });
        });
    } catch (e) {
        reply(`${e}`);
    }
});
