const { cmd } = require('../command');
const { sleep } = require('../lib/functions');

cmd({
    pattern: "leavee",
    desc: "Leave the group",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply
}) => {
    try {
        // Get the bot owner's number dynamically from conn.user.id
        const botOwner = conn.user.id.split(":")[0]; // Extract the bot owner's number
        if (senderNumber !== botOwner) {
            return reply("Only the bot owner can use this command.");
        }

        // Command to leave the group
        reply("Leaving group...");
        await sleep(1500);
        await conn.groupLeave(from);
        reply("Goodbye! 👋");
    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e}`);
    }
});
