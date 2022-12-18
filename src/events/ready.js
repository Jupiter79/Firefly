const { SlashCommandBuilder, Events } = require('discord.js');

module.exports = {
    event: Events.ClientReady,
    handle(c) {
        console.log(`Ready! Logged in as ${c.user.tag}`);
    }
}