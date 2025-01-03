const Jimp = require('jimp');
const { cmd } = require('../command');
const { getRandom } = require('../lib/functions');

var imgmsg = 'Please reply to a sticker!';
var descg = 'Converts a sticker to an image.';

cmd({
    pattern: 'sticker2img',
    react: '🖼️',
    alias: ['s2i', 'stickerimg'],
    desc: descg,
    category: 'convert',
    use: '.sticker2img <Reply to sticker>',
    filename: __filename
}, async (conn, mek, m, { from, reply, isCmd, command, args, q, isGroup, pushname }) => {
    try {
        const isQuotedSticker = m.quoted && m.quoted.type === 'stickerMessage';

        if (isQuotedSticker) {
            const stickerBuffer = await m.quoted.download();
            const namePng = getRandom('.png'); // Generate random filename for PNG output

            // Convert sticker buffer to PNG image using Jimp
            const image = await Jimp.read(stickerBuffer);
            await image.writeAsync(namePng); // Save the processed image

            // Send the converted image back
            await conn.sendMessage(from, { image: { url: namePng }, caption: 'Here is your image!' }, { quoted: mek });
        } else {
            return await reply(imgmsg);
        }
    } catch (e) {
        console.error('Error while converting sticker to image:', e);
        reply('Error while converting sticker to image! Please ensure you are replying to a valid sticker.');
    }
});
