const { jidDecode } = require('@whiskeysockets/baileys');

// Helper function to decode JID
const decodeJid = (jid) => {
  try {
    const decodedJid = jidDecode(jid);
    console.log('Decoded Jid:', decodedJid);
    const { user } = decodedJid;
    // Use `user` only if it's defined
    if (user) {
      return user;
    } else {
      throw new Error('User not found in jid decode response.');
    }
  } catch (error) {
    console.error('Jid decode error:', error);
    return null; // Return null if decoding fails
  }
};

// Example usage
const result = decodeJid('some_jid_string');
if (result) {
  console.log('User:', result);
} else {
  console.log('Failed to decode Jid.');
}

// Example handler where jidDecode might be used
const handler = async (m, { conn, args }) => {
  // Ensure that jid is defined before use
  const userId = decodeJid(m.sender);
  if (!userId) {
    return conn.reply(m.chat, 'Failed to decode JID.');
  }

  // Continue processing
};
module.exports = handler;
