const { cmd } = require('../command');
const fetch = require('node-fetch');

cmd({
    pattern: "bing",
    alias: ["jawad", "dj"],
    react: "🤖",
    desc: "Chat with AI using a custom API.",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("❗ Please provide a prompt for the AI to respond to.");

        const username = m.sender.split('@')[0]; // Extract sender username
        const prompt = encodeURIComponent(q); // Encode the user query

        // Build the API URL
        const apiurl = `https://gpt4.guruapi.tech/bing?username=${username}&query=${prompt}`;

        // Fetch the response from the API
        const result = await fetch(apiurl);
        const response = await result.json();

        if (!response.result) throw "No result found.";

        const replyText = response.result;

        // Reply with the AI's response
        return reply(`💬 *AI Response:*\n\n${replyText}`);
    } catch (error) {
        console.error(error);
        reply("❌ Oops! Something went wrong. Please try again later.");
    }
});
