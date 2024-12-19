const fetch = require('node-fetch');
const decodeJid = require('./handler'); // Import the helper function
const { cmd } = require('../command'); // Importing cmd from command.js

// Get pair code command handler
const getPairCode = async (m, reply, conn) => {
  const cooldown = new Map();
  try {
    const args = m.body.split(' ').slice(1); // Extract arguments after the command
    const sender = decodeJid(m.sender); // Safely decode the JID
    const chat = m.from;
    const now = Date.now();

    // Cooldown check
    const lastRequest = cooldown.get(sender);
    if (sender !== "923448149931@s.whatsapp.net" && lastRequest && now - lastRequest < 300000) {
      const remainingTime = 300000 - (now - lastRequest);
      const minutes = Math.floor(remainingTime / 60000);
      const seconds = ((remainingTime % 60000) / 1000).toFixed(0);
      return reply(`Please wait ${minutes} minute(s) and ${seconds} second(s) before requesting again.`);
    }

    // Validate phone number argument
    if (!args[0]) {
      return reply('Please provide a phone number.\n*Example:* `.getpair 923448149931`');
    }

    const phoneNumber = encodeURIComponent(args[0]);
    const apiUrl = `https://short-pair-for-heorku.onrender.com/pair?phone=${phoneNumber}`;

    reply('Fetching your pairing code. Please wait...');

    // Fetch pairing code
    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.statusText}. Details: ${errorText}`);
    }

    const data = await response.json();

    if (data.code) {
      const pairCode = data.code;
      const message = `*⚡Pairing Code⚡*\n\n💜 A verification code has been sent to your phone number. Please check your phone and copy this code to pair it and get your Prince bot session ID.\n\n*🔢 Code:* \`${pairCode}\`\n*_Copy it from below_*`;

      const imagePayload = {
        url: 'https://envs.sh/wlR.jpg',
      };

      await conn.sendMessage(chat, { image: imagePayload, caption: message }); // Send image with caption
      reply(`${pairCode}`); // Send plain code as a follow-up message
      cooldown.set(sender, now); // Update cooldown
    } else if (data.error) {
      reply(`Error: ${data.error}`);
    } else {
      reply(`Unexpected response structure: ${JSON.stringify(data)}`);
    }
  } catch (error) {
    console.error('Error:', error);
    reply(`Error: ${error.message}`);
  }
};

// Register the .getpair command
cmd({
  pattern: 'getpair', // Command trigger
  desc: 'Fetch pairing code',
  category: 'tools',
  filename: __filename,
},
async (conn, mek, m, { reply }) => {
  await getPairCode(m, reply, conn); // Pass conn to handle the message sending
});
