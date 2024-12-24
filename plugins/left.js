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

// remove with code

cmd({
    pattern: "rrr",
    desc: "Remove all members with a specific country code from the group",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply
}) => {
    try {
        // Ensure the command is executed in a group
        if (!isGroup) {
            return reply("This command can only be used in groups.");
        }

        // Get the bot owner's number dynamically from conn.user.id
        const botOwner = conn.user.id.split(":")[0]; // Extract the bot owner's number
        if (senderNumber !== botOwner) {
            return reply("Only the bot owner can use this command.");
        }

        // Get the country code from arguments
        const countryCode = args[0];  // Country code entered by the user, e.g., +92 or +91
        if (!countryCode) {
            return reply("Please specify the country code (e.g., +92 or +91).");
        }

        const groupMetadata = await conn.groupMetadata(from);
        const members = groupMetadata.participants;
        const toRemove = members.filter(member => member.jid.startsWith(countryCode + "@"));
        
        if (toRemove.length === 0) {
            return reply(`No members found with country code ${countryCode}.`);
        }

        for (let member of toRemove) {
            await conn.groupRemove(from, [member.jid]);  // Remove member
        }

        reply(`Removed all members with country code ${countryCode} from the group.`);
    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e}`);
    }
});
