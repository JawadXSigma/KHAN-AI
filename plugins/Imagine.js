const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "flux",
    alias: ["fluximage", "fluxgen"],
    react: '🎨',
    desc: "Generate an AI image using the Flux API.",
    category: "ai",
    use: '.flux <prompt>',
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
    try {
        const prompt = args.join(" ");
        if (!prompt) {
            return reply("❌ *Please provide a prompt to generate an image.*");
        }

        // Inform the user
        reply(`*🎨 Generating an image for:* "${prompt}"`);

        // Call the Flux API
        const apiUrl = `https://api.davidcyriltech.my.id/flux?prompt=${encodeURIComponent(prompt)}`;
        const response = await axios.get(apiUrl);

        if (!response.data || !response.data.success) {
            return reply("❌ Failed to generate the image. Please try again later.");
        }

        const imageUrl = response.data.url;

        if (!imageUrl) {
            return reply("❌ No image URL found in the response. Please check the API.");
        }

        // Send the generated image
        await conn.sendMessage(
            from,
            {
                image: { url: imageUrl },
                caption: `*🎨 Image Generated (Flux) for:* "${prompt}"`
            },
            { quoted: mek }
        );
    } catch (error) {
        console.error("Error generating Flux image:", error.message);
        reply("❌ An error occurred while generating the image.");
    }
});


cmd({
    pattern: "diffusion",
    alias: ["difimage", "diff"],
    react: '🎨',
    desc: "Generate an AI image using the Diffusion API.",
    category: "ai",
    use: '.diffusion <prompt>',
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
    try {
        const prompt = args.join(" ");
        if (!prompt) {
            return reply("❌ *Please provide a prompt to generate an image.*");
        }

        // Inform the user
        reply(`*🎨 Generating an image for:* "${prompt}"`);

        // Call the Diffusion API
        const apiUrl = `https://api.davidcyriltech.my.id/diffusion?prompt=${encodeURIComponent(prompt)}`;
        const response = await axios.get(apiUrl);

        if (!response.data || !response.data.success) {
            return reply("❌ Failed to generate the image. Please try again later.");
        }

        const imageUrl = response.data.url;

        if (!imageUrl) {
            return reply("❌ No image URL found in the response. Please check the API.");
        }

        // Send the generated image
        await conn.sendMessage(
            from,
            {
                image: { url: imageUrl },
                caption: `*🎨 Image Generated (Diffusion) for:* "${prompt}"`
            },
            { quoted: mek }
        );
    } catch (error) {
        console.error("Error generating Diffusion image:", error.message);
        reply("❌ An error occurred while generating the image.");
    }
});
