const { Events } = require('discord.js');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const checkGuildExists = async (guild) => {
    var checkGuild = await prisma.guild.findUnique({
        where: { id: guild.id }
    });

    if (!checkGuild) await prisma.guild.create({
        data: { id: guild.id }
    })
}

const getUsedLanguage = (interaction) => {
    var usedLanguage = interaction.locale;

    return global.LANGUAGES.list.includes(usedLanguage) ? global.LANGUAGES[usedLanguage] : global.LANGUAGES["default"];
}

module.exports = {
    event: Events.InteractionCreate,
    async handle(interaction) {
        if (!interaction.isChatInputCommand()) return;

        interaction.translation = getUsedLanguage(interaction).commands[interaction.commandName].content;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        await checkGuildExists(interaction.guild);

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}