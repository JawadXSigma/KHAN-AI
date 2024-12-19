const config = require('../config');
const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const axios = require('axios');

cmd({
    pattern: "env",
    alias: ["setting", "allvar"],
    desc: "Settings of bot",
    category: "menu",
    react: "⚡",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `╭━━〔 *Variable List* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃• *OWNER_NAME* - ${config.OWNER_NAME}
┃◈┃• *BOT_NAME* - ${config.BOT_NAME}
┃◈┃• *DELETE_LINKS* - ${config.DELETE_LINKS}
┃◈┃• *OWNER_NUMBER* - ${config.OWNER_NUMBER}
┃◈┃• *PREFIX* - ${config.BOT_PREFIX}
┃◈┃• *LIVE_MSG* - ${config.LIVE_MSG}
┃◈┃• *ALIVE_IMG* - ${config.ALIVE_IMG}
┃◈┃• *DESCRIPTION* - ${config.DESCRIPTION}
┃◈┃• *READ_MESSAGE* - ${config.READ_MESSAGE}
┃◈┃• *ANTI_BAD* - ${config.ANTI_BAD}
┃◈┃• *AUTO_REACT* - ${config.AUTO_REACT}
┃◈┃• *AUTO_STATUS_SEEN* - ${config.AUTO_STATUS_SEEN}
┃◈┃• *AUTO_STATUS_REPLY* - ${config.AUTO_STATUS_REPLY}
┃◈┃• *AUTO_STATUS_MSG* - ${config.AUTO_STATUS_MSG}
┃◈┃• *AUTO_VOICE* - ${config.AUTO_VOICE}
┃◈┃• *AUTO_STICKER* - ${config.AUTO_STICKER}
┃◈┃• *ANTI_LINK* - ${config.ANTI_LINK}
┃◈┃• *MODE* - ${config.MODE}
┃◈┃• *HEART_REACT* - ${config.HEART_REACT}
┃◈┃• *OWNER_REACT* - ${config.OWNER_REACT}
┃◈┃• *AUTO_REPLY* - ${config.AUTO_REPLY}
┃◈┃• *AUTO_TYPING* - ${config.AUTO_TYPING}
┃◈┃• *AUTO_RECORDING* - ${config.AUTO_RECORDING}
┃◈└───────────┈⊷
╰──────────────┈⊷
> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX`;

        // Send message with image
        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/149k8x.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363354023106228@newsletter',
                        newsletterName: 'JawadTechX',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

        // Send audio
        await conn.sendMessage(from, {
            audio: { url: 'https://github.com/JawadYTX/KHAN-DATA/raw/refs/heads/main/autovoice/sigma.m4a' }, // Audio URL
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
