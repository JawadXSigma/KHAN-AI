const config = require("../config"); 
const { cmd, commands } = require("../command");
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, runtime, sleep, fetchJson } = require("../lib/functions");

// Command 
const leaveCommand = {
  pattern: "leavee",  // command 
  react: '🔓',  // react
  alias: "lefft",  // secend command
  desc: "To leave from the group",  // Description
  category: "group",  // Category
  use: '.leave',  // Usage
  filename: __filename  // Filename
};

// Register the command
cmd(leaveCommand, async (client, message, chat, options) => {
  try {
    // Define the error messages directly
    const onlyGroupMessage = "This command can only be used in groups.";
    const onlyOwnerMessage = "Only the bot owner can use this command.";

    // Check if the command is executed in a group
    if (!options.isGroup) {
      return message.reply(onlyGroupMessage);  // Reply if not in a group
    }
    
    // Check if the user is the owner or admin
    if (!options.isAdmins && !options.isOwner) {
      return message.reply(onlyOwnerMessage);  // Reply if not an admin or owner
    }
    
    // Send a goodbye message
    const goodbyeMessage = { text: "*Good Bye All* 👋🏻" };
    const quotedMessage = { quoted: message };  // Reference the original message
    await client.sendMessage(chat.from, goodbyeMessage, quotedMessage);
    
    // Command to leave the group
    await client.groupLeave(chat.from);

  } catch (error) {
    // Error handling
    const errorReaction = { text: '❌', key: message.key };
    const reactError = { react: errorReaction };
    await client.sendMessage(chat.from, reactError);
    console.error(error);  // Log the error
    message.reply("❌ *Error occurred!* \n\n" + error);
  }
});
