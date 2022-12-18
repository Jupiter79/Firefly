const { Events } = require('discord.js');

module.exports = {
    event: Events.ClientReady,
    handle(c) {
        console.log(`Ready super! Logged in as ${c.user.tag}`);
    }
}