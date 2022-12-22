const { Events } = require('discord.js');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

module.exports = {
    event: Events.MessageCreate,
    async handle(message) {
        if (!message.author.bot) {
            var guild = await prisma.guild.findUnique({
                where: { id: message.guild.id }
            })

            if (guild?.counting_channel == message.channel.id) {
                var number = parseInt(message.content);

                if (isNaN(number)) return message.reply("This is a counting channel, you can only write numbers here!").then(x => setTimeout(() => x.delete(), 1000 * 2));

                if (message.author.id == guild.counting_last_user) {
                    await message.delete();

                    return await message.channel.send("An other user must type the next number!").then(x => setTimeout(() => x.delete(), 1000 * 2))
                }

                if (guild.counting_last_number == 0 && number != guild.counting_last_number + 1) return message.reply("You need to start with a \`1\`").then(x => setTimeout(() => x.delete(), 1000 * 2));

                if (number != guild.counting_last_number + 1) {
                    await prisma.guild.update({ where: { id: message.guild.id }, data: { counting_last_user: null, counting_last_number: 0 } });

                    message.channel.send(`${message.author.toString()} broke the record of \`${guild.counting_last_number}\`!\nThe number has been reset to \`0\``);
                } else {
                    await prisma.guild.update({ where: { id: message.guild.id }, data: { counting_last_user: message.author.id, counting_last_number: number } });
                }
            }
        }
    }
}