const { Events } = require('discord.js');

const Logger = require("../logger/index.js");
const Database = require("../database/index.js");
const Lang = require("../lang/index.js");

module.exports = {
    event: Events.InteractionCreate,
    async handle(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        if (interaction.guild) interaction.dbGuild = await Database.getGuild(interaction);

        var usedLanguage = Lang.getUsedLanguage(interaction);
        
        interaction.translation = usedLanguage.commands[interaction.commandName]?.content;

        try {
            await command.execute(interaction);
            Logger.newCommand(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "An error occured while executing the command!", ephemeral: true });
        }
    }
}