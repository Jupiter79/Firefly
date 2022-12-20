const { Events } = require('discord.js');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

module.exports = {
    event: Events.GuildMemberAdd,
    async handle(member) {
        var guild = await prisma.guild.findUnique({
            where: { id: member.guild.id }
        })

        if (guild?.welcome_channel) {
            member.guild.channels.fetch(guild.welcome_channel)
                .then(c => c.send(`Hey ${member.toString()}, welcome to **${member.guild.name}**!`))
                .catch(() => prisma.guild.update({ where: { id: member.guild.id }, data: { welcome_channel: null } }))
        }
    }
}