const { cmd, commands } = require('../command');
const axios = require('axios');

// Imagine command using the new API
cmd({
    pattern: "imagine",
    alias: ["im", "imagineai"],
    react: '🖼️',
    desc: "Generate an AI image based on a prompt.",
    category: "image",
    use: '.imagine <prompt>',
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
    try {
        const prompt = args.join(" ");
        if (!prompt) return reply("*Please provide a prompt to generate the image.*");

        // Inform the user
        reply("*🖼️ Generating AI image...*");

        // API URL for imagine
        const imagineApiUrl = `https://api.davidcyriltech.my.id/flux?prompt=${encodeURIComponent(prompt)}`;

        // Fetch image from the API
        const imageResponse = await axios.get(imagineApiUrl);
        if (!imageResponse.data || !imageResponse.data.success) {
            return reply("❌ Failed to generate the image. Please try again later.");
        }

        // Extract image URL
        const imageUrl = imageResponse.data.image;
        if (imageUrl) {
            await conn.sendMessage(
                from,
                { image: { url: imageUrl }, caption: `Generated Image for: ${prompt}` },
                { quoted: mek }
            );
        }
    } catch (e) {
        console.error(e);
        reply("❌ An error occurred while generating the image.");
    }
});
