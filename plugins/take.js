const { cmd } = require('../command');
const { Sticker } = require('wa-sticker-formatter');

/**
 * Rename the sticker pack of a given sticker buffer.
 * 
 * @param {Buffer} stickerBuffer - The original sticker buffer.
 * @param {string} packName - The new pack name.
 * @param {string} [authorName] - The author name (optional).
 * @returns {Buffer} - The updated sticker buffer with the new pack name.
 */
async function renameStickerPack(stickerBuffer, packName, authorName = 'Bot') {
    try {
        // Create a new sticker with the updated pack name
        const sticker = new Sticker(stickerBuffer, {
            pack: packName, // New pack name
            author: authorName, // Author name
            type: Sticker.Types.FULL, // Retain original sticker type
            quality: 75 // Output quality
        });

        // Convert to buffer
        return await sticker.toBuffer();
    } catch (error) {
        console.error('Error renaming sticker pack:', error);
        throw new Error('Failed to rename sticker pack.');
    }
}

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
        // Check if the message is a reply to a sticker
        const isQuotedSticker = m.quoted && m.quoted.type === 'stickerMessage';

        if (!isQuotedSticker) {
            return await reply('⚠️ Please reply to a sticker to rename it!');
        }

        if (!q) {
            return await reply('⚠️ Please provide a new pack name!\nUsage: `.take <new pack name>`');
        }

        // Download the quoted sticker buffer
        const stickerBuffer = await m.quoted.download();
        if (!stickerBuffer) {
            return await reply('⚠️ Failed to download the sticker. Please try again.');
        }

        // Rename the sticker pack
        const renamedStickerBuffer = await renameStickerPack(stickerBuffer, q.trim());
        if (!renamedStickerBuffer) {
            return await reply('❌ Error creating the new sticker. Please check the input format.');
        }

        // Send the renamed sticker back
        await conn.sendMessage(from, { sticker: renamedStickerBuffer }, { quoted: mek });

    } catch (e) {
        console.error('Error renaming sticker pack:', e);
        reply(`❌ Error renaming sticker pack: ${e.message}`);
    }
});
