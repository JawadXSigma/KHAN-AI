const { cmd } = require('../command');
const fetch = require('node-fetch');

cmd({
    pattern: "bing",
    alias: ["jarvis", "dj"],
    react: "🤖",
    desc: "Chat with AI using a custom API.",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) {
            return reply("❗ Please provide a prompt for the AI to respond to.");
        }

        const username = m.sender.split('@')[0]; // Extract sender username
        const prompt = encodeURIComponent(q); // Encode the user query
        const apiurl = `https://gpt4.guruapi.tech/bing?username=${username}&query=${prompt}`;

        console.log(`API URL: ${apiurl}`); // Log the API URL

        // Fetch the response from the API
        const result = await fetch(apiurl);
        const response = await result.json();

        console.log("API Response:", response); // Log the full response

        if (!response.result) {
            console.error("API Response does not contain 'result':", response);
            throw "The API returned an invalid response.";
        }

        const replyText = response.result;

        // Reply with the AI's response
        return reply(`💬 *AI Response:*\n\n${replyText}`);
    } catch (error) {
        console.error("Error occurred:", error.message || error);
        reply("❌ Oops! Something went wrong. Please try again later.");
    }
});
