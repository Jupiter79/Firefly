const { Events } = require('discord.js');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const Database = require("../database/index.js");
const LANG = global.EVENT_META["countingGame"];

module.exports = {
    event: Events.MessageCreate,
    async handle(message) {
        if (!message.author.bot) {
            var guild = await prisma.guild.findUnique({
                where: { id: message.guild.id }
            })

            if (guild?.counting_channel == message.channel.id) {
                let guildLanguage = await Database.getGuildLanguage(message.guild);
                let USED_LANG = LANG[guildLanguage == "en" ? "default" : guildLanguage];

                var number = parseInt(message.content);

                if (isNaN(number)) {
                    await message.delete();
                    return message.channel.send(USED_LANG.only_numbers).then(x => setTimeout(() => x.delete(), 1000 * 2));
                }

                if (message.author.id == guild.counting_last_user) {
                    await message.delete();

                    return await message.channel.send(USED_LANG.other_user).then(x => setTimeout(() => x.delete(), 1000 * 2))
                }

                if (guild.counting_last_number == 0 && number != guild.counting_last_number + 1) return message.reply(USED_LANG.start_with_one).then(x => setTimeout(() => x.delete(), 1000 * 2));

                if (number != guild.counting_last_number + 1) {
                    await prisma.guild.update({ where: { id: message.guild.id }, data: { counting_last_user: null, counting_last_number: 0 } });

                    message.channel.send(USED_LANG.reset.replace("{{user}}", message.author.toString()).replace("{{number}}", guild.counting_last_number))
                } else {
                    await prisma.guild.update({ where: { id: message.guild.id }, data: { counting_last_user: message.author.id, counting_last_number: number } });
                }
            }
        }
    }
}