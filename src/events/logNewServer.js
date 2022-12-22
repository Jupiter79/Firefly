const { Events } = require('discord.js');

const Logger = require("../logger/index.js");

module.exports = {
    event: Events.GuildCreate,
    async handle(guild) {
        Logger.newServer(guild);
    }
}