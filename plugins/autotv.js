const fs = require('fs');
const path = require('path');
const config = require('../config');
const { cmd, commands } = require('../command');

// Fake recording
cmd({
  on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {       
    if (config.FAKE_RECORDING === 'true') {
        await conn.sendPresenceUpdate('recording', from);
    }
});

// Auto voice
cmd({
  on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {
    const filePath = path.join(__dirname, '../data/autovoice.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const text in data) {
        if (body.toLowerCase() === text.toLowerCase()) {
            if (config.AUTO_VOICE === 'true') {
                await conn.sendPresenceUpdate('recording', from);
                await conn.sendMessage(from, { audio: { url: data[text] }, mimetype: 'audio/mpeg', ptt: true }, { quoted: mek });
            }
        }
    }                
});

// Auto sticker
cmd({
  on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {
    const filePath = path.join(__dirname, '../data/autosticker.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const text in data) {
        if (body.toLowerCase() === text.toLowerCase()) {
            if (config.AUTO_STICKER === 'true') {
                await conn.sendMessage(from, { sticker: { url: data[text] }, package: 'SILENT LOVER' }, { quoted: mek });   
            }
        }
    }                
});

// Auto reply
cmd({
  on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {
    const filePath = path.join(__dirname, '../data/autoreply.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const text in data) {
        if (body.toLowerCase() === text.toLowerCase()) {
            if (config.AUTO_REPLY === 'true') {
                await m.reply(data[text]);
            }
        }
    }                
});

const fs = require('fs');
const path = require('path');
const config = require('../config');
const { cmd, commands } = require('../command');

// Fake recording
cmd({
  on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {       
    if (config.FAKE_RECORDING === 'true') {
        await conn.sendPresenceUpdate('recording', from);
    }
});

// Auto voice
cmd({
  on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {
    const filePath = path.join(__dirname, '../data/autovoice.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const text in data) {
        if (body.toLowerCase() === text.toLowerCase()) {
            if (config.AUTO_VOICE === 'true') {
                await conn.sendPresenceUpdate('recording', from);
                await conn.sendMessage(from, { audio: { url: data[text] }, mimetype: 'audio/mpeg', ptt: true }, { quoted: mek });
            }
        }
    }                
});

// Auto sticker
cmd({
  on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {
    const filePath = path.join(__dirname, '../data/autosticker.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const text in data) {
        if (body.toLowerCase() === text.toLowerCase()) {
            if (config.AUTO_STICKER === 'true') {
                await conn.sendMessage(from, { sticker: { url: data[text] }, package: 'SILENT LOVER' }, { quoted: mek });   
            }
        }
    }                
});

// Auto reply
cmd({
  on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {
    const filePath = path.join(__dirname, '../data/autoreply.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const text in data) {
        if (body.toLowerCase() === text.toLowerCase()) {
            if (config.AUTO_REPLY === 'true') {
                await m.reply(data[text]);
            }
        }
    }                
});

let currentPresence = null; // Initialize with no presence status

cmd({
    on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {
    try {
        // Determine the desired presence status
        const targetPresence = config.ONLINE === 'true' ? 'available' : 'unavailable';

        // Only update presence if it differs from the current state
        if (currentPresence !== targetPresence) {
            await conn.sendPresenceUpdate(targetPresence, from);
            currentPresence = targetPresence; // Update the tracked presence
            console.log(`Presence updated to: ${targetPresence}`);
        }
    } catch (error) {
        console.error('Error updating presence:', error);
    }
});
