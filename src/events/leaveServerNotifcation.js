const { Events } = require('discord.js');

const Logger = require("../logger/index.js");

module.exports = {
    event: Events.GuildDelete,
    async handle(guild) {
        Logger.leftServer(guild);
    }
}