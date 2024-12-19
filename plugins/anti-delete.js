const config = require('../config'); // Adjust the path to your config file

module.exports = {
    name: 'anti-delete',
    description: 'Detect and log deleted messages',
    async function(conn) {
        if (config.ANTI_DELETE === "true") { // Check if the feature is enabled in the config
            console.log("Anti-Delete is enabled.");

            conn.ev.on('messages.delete', async (message) => {
                try {
                    const deletedMessage = await conn.loadMessage(message.remoteJid, message.id);
                    if (deletedMessage) {
                        const deletedContent = deletedMessage.message;

                        let notificationText = `🚨 Deleted Message Detected 🚨\n\n`;
                        notificationText += `From: ${deletedMessage.pushName} (@${deletedMessage.participant.split('@')[0]})\n`;

                        if (deletedContent) {
                            if (deletedContent.conversation) {
                                notificationText += `Message: ${deletedContent.conversation}`;
                            } else if (deletedContent.extendedTextMessage) {
                                notificationText += `Message: ${deletedContent.extendedTextMessage.text}`;
                            } else if (deletedContent.imageMessage) {
                                notificationText += `Message: [Image with caption: ${deletedContent.imageMessage.caption}]`;
                            } else if (deletedContent.videoMessage) {
                                notificationText += `Message: [Video with caption: ${deletedContent.videoMessage.caption}]`;
                            } else {
                                notificationText += `Message: [${Object.keys(deletedContent)[0]} message]`;
                            }
                        } else {
                            notificationText += `Message: [Unable to retrieve deleted content]`;
                        }

                        // Send notification to the chat where the message was deleted
                        await conn.sendMessage(message.remoteJid, { text: notificationText });

                        // If it's an image or video, send the media as well
                        if (deletedContent && (deletedContent.imageMessage || deletedContent.videoMessage)) {
                            const media = await conn.downloadMediaMessage(deletedMessage);
                            await conn.sendMessage(message.remoteJid, { image: media, caption: 'Deleted media' });
                        }
                    }
                } catch (error) {
                    console.error('Error handling deleted message:', error);
                }
            });
        } else {
            console.log("Anti-Delete is disabled in the configuration.");
        }
    }
};
