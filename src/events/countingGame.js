const { Events } = require('discord.js');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

module.exports = {
    event: Events.MessageCreate,
    async handle(message) {
        var guild = await prisma.guild.findUnique({
            where: { id: message.guild.id }
        })

        if (guild?.counting_channel == message.channel.id) {
            var number = parseInt(message.content);

            if (number == NaN) return message.delete();
            if (number <= guild.counting_last_number) {
                await prisma.guild.update({ where: { id: message.guild.id }, data: { counting_last_number: 0 } });

                message.channel.send(`${message.author.toString()} broke the record of \`${guild.counting_last_number}\`!`);
            } else {
                prisma.guild.update({ where: { id: message.guild.id }, data: { counting_last_number: number } });
            }
        }
    }
}