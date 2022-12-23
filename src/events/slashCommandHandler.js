const { Events } = require('discord.js');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const Logger = require("../logger/index.js");
const Lang = require("../lang/index.js");

const checkGuildExists = async (guild) => {
    var checkGuild = await prisma.guild.findUnique({
        where: { id: guild.id }
    });

    if (!checkGuild) await prisma.guild.create({
        data: { id: guild.id }
    })
}

module.exports = {
    event: Events.InteractionCreate,
    async handle(interaction) {
        if (!interaction.isChatInputCommand()) return;

        var usedLanguage = Lang.getUsedLanguage(interaction);

        interaction.translation = usedLanguage.commands[interaction.commandName].content;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        if (interaction.guild) await checkGuildExists(interaction.guild);

        try {
            await command.execute(interaction);
            Logger.newCommand(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "An error occured while executing the command!", ephemeral: true });
        }
    }
}