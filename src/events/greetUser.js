const { Events } = require('discord.js');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const Database = require("../database/index.js");
const LANG = global.EVENT_META["greetUser"];
module.exports = {
    event: Events.GuildMemberAdd,
    async handle(member) {
        var guild = await Database.getGuild(member.guild);

        if (guild?.welcome_channel) {
            member.guild.channels.fetch(guild.welcome_channel)
                .then(async c => c.send(LANG[await Database.getGuildLanguage(member.guild, true)].replace("{{user}}", member.toString()).replace("{{guild}}", `**${member.guild.name}**`)))
                .catch(() => prisma.guild.update({ where: { id: member.guild.id }, data: { welcome_channel: null } }))
        }
    }
}