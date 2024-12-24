const { cmd } = require('../command');
const Jimp = require("jimp");
var { S_WHATSAPP_NET } = require('@whiskeysockets/baileys');

cmd({
    pattern: "fullpp",
    desc: "Changes profile picture.",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply
}) => {
    try {
        // Get the bot owner's number dynamically from conn.user.id
        const botOwner = conn.user.id.split(":")[0]; // Extract the bot owner's number
        if (senderNumber !== botOwner) {
            return reply("Only the bot owner can use this command.");
        }

        // Ensure the command is used with a quoted image
        if (!m.quoted || !m.quoted.message || !m.quoted.message.imageMessage) {
            return reply("Please reply to an image to set it as the profile picture.");
        }

        // Download the quoted image
        const media = await m.quoted.download();

        // Process the image using Jimp
        const jimp = await Jimp.read(media);
        const min = jimp.getWidth();
        const max = jimp.getHeight();
        const cropped = jimp.crop(0, 0, min, max);

        // Scale the image to 720x720 and get the buffer
        const img = await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG);

        // Update the profile picture
        await conn.query({
            tag: 'iq',
            attrs: {
                to: S_WHATSAPP_NET,
                type: 'set',
                xmlns: 'w:profile:picture',
            },
            content: [
                {
                    tag: 'picture',
                    attrs: { type: 'image' },
                    content: img,
                },
            ],
        });

        return reply("Profile picture updated successfully.");
    } catch (err) {
        console.error('Error:', err);
        return reply(`An error occurred: ${err.message}`);
    }
});
