const config = require('../config');
const { Sticker } = require('wa-sticker-formatter');
const { cmd } = require('../command');
const { getRandom } = require('../lib/functions');
const fs = require('fs').promises;

cmd({
    pattern: 'take',
    react: '✍️',
    alias: ['rename'],
    desc: 'Rename sticker pack name.',
    category: 'convert',
    use: '.take <new pack name>',
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        const isQuotedSticker = m.quoted && m.quoted.type === 'stickerMessage';

        if (isQuotedSticker) {
            if (!q) {
                return await reply('⚠️ Please provide a new pack name!\nUsage: `.take <new pack name>`');
            }

            // Download the quoted sticker
            const stickerBuffer = await m.quoted.download();
            const tempStickerFile = getRandom('.webp');
            await fs.writeFile(tempStickerFile, stickerBuffer);

            // Create a new sticker with updated pack name
            const newSticker = new Sticker(tempStickerFile, {
                pack: q.trim(), // New pack name from command
                author: '', // Author name remains empty
                type: Sticker.Types.FULL, // Retain the original sticker type
                quality: 75 // Quality of the output sticker
            });

            const buffer = await newSticker.toBuffer();

            // Send the renamed sticker back
            await conn.sendMessage(from, { sticker: buffer }, { quoted: mek });

            // Cleanup temporary file
            await fs.unlink(tempStickerFile);
        } else {
            return await reply('⚠️ Please reply to a sticker to rename it!');
        }
    } catch (e) {
        reply('❌ Error renaming sticker pack!');
        console.error(e);
    }
});
