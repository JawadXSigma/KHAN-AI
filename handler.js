const { jidDecode } = require('@whiskeysockets/baileys');

// Helper function to decode JID
const decodeJid = (jid) => {
  try {
    const decoded = jidDecode(jid);
    if (decoded && decoded.user) {
      return decoded.user; // Return the user part of the JID
    } else {
      console.error('Failed to decode JID or user part is undefined.');
      return null;
    }
  } catch (error) {
    console.error('Error decoding JID:', error);
    return null;
  }
};

// Exporting decodeJid so it can be reused
module.exports = { decodeJid };
