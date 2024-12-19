const config = require('../config'); // Adjust the path to your config file

module.exports = {
    name: 'anti-delete',
    description: 'Detect and log deleted messages',
    async function(conn) {
        if (config.ANTI_DELETE === "true") { // Check if the feature is enabled
            console.log("Anti-Delete is enabled.");

            conn.ev.on('messages.delete', async (message) => {
                try {
                    const deletedMessage = await conn.loadMessage(message.remoteJid, message.id);
                    if (deletedMessage) {
                        const deletedContent = deletedMessage.message;

                        let notificationText = `🚨 Deleted Message Detected 🚨\n\n`;
                        notificationText += `From: ${deletedMessage.pushName || 'Unknown'} (@${deletedMessage.participant.split('@')[0]})\n`;

                        // Process deleted message content
                        if (deletedContent) {
                            if (deletedContent.conversation) {
                                notificationText += `Message: ${deletedContent.conversation}`;
                            } else if (deletedContent.extendedTextMessage) {
                                notificationText += `Message: ${deletedContent.extendedTextMessage.text}`;
                            } else if (deletedContent.imageMessage) {
                                notificationText += `Message: [Image with caption: ${deletedContent.imageMessage.caption || 'No caption'}]`;
                            } else if (deletedContent.videoMessage) {
                                notificationText += `Message: [Video with caption: ${deletedContent.videoMessage.caption || 'No caption'}]`;
                            } else if (deletedContent.documentMessage) {
                                notificationText += `Message: [Document: ${deletedContent.documentMessage.fileName}]`;
                            } else if (deletedContent.audioMessage) {
                                notificationText += `Message: [Audio message]`;
                            } else {
                                notificationText += `Message: [${Object.keys(deletedContent)[0]} message]`;
                            }
                        } else {
                            notificationText += `Message: [Unable to retrieve deleted content]`;
                        }

                        // Send notification to the chat where the message was deleted
                        await conn.sendMessage(message.remoteJid, { text: notificationText });

                        // Handle media (image, video, document, etc.)
                        if (deletedContent && (deletedContent.imageMessage || deletedContent.videoMessage || deletedContent.documentMessage || deletedContent.audioMessage)) {
                            const media = await conn.downloadMediaMessage(deletedMessage);
                            if (deletedContent.imageMessage) {
                                await conn.sendMessage(message.remoteJid, { image: media, caption: 'Deleted Image' });
                            } else if (deletedContent.videoMessage) {
                                await conn.sendMessage(message.remoteJid, { video: media, caption: 'Deleted Video' });
                            } else if (deletedContent.documentMessage) {
                                await conn.sendMessage(message.remoteJid, { document: media, fileName: deletedContent.documentMessage.fileName, mimetype: deletedContent.documentMessage.mimetype });
                            } else if (deletedContent.audioMessage) {
                                await conn.sendMessage(message.remoteJid, { audio: media, mimetype: 'audio/mp4', ptt: true });
                            }
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
