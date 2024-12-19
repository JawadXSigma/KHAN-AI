const fetch = require('node-fetch');
const { decodeJid } = require('./handler'); // Import decodeJid from handler.js
const { cmd } = require('../command'); // Assuming you have a command handler

const getPairCode = async (m, reply, conn) => {
  try {
    const args = m.body.split(' ').slice(1);
    const sender = decodeJid(m.sender); // Use decodeJid to decode sender
    if (!sender) return reply('Failed to decode your JID.');

    if (!args[0]) {
      return reply('Please provide a phone number.\nExample: `.getpair 923448149931`');
    }

    const phoneNumber = encodeURIComponent(args[0]);
    const apiUrl = `https://short-pair-for-heorku.onrender.com/pair?phone=${phoneNumber}`;

    reply('Fetching your pairing code. Please wait...');

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch pairing code: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.code) {
      const pairCode = data.code;
      const message = `*⚡Pairing Code⚡*\n\n🔢 Code: \`${pairCode}\``;

      await conn.sendMessage(m.chat, { text: message });
      reply(`${pairCode}`);
    } else {
      reply(`Error: ${data.error || 'Unknown error occurred'}`);
    }
  } catch (error) {
    console.error('Error in getPairCode:', error);
    reply(`Error: ${error.message}`);
  }
};

// Register the command
cmd({
  pattern: 'getpair',
  desc: 'Fetch pairing code',
  category: 'tools',
},
async (conn, mek, m, { reply }) => {
  await getPairCode(m, reply, conn);
});
