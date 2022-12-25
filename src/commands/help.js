const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const name = "help";
module.exports = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription("Shows all commands of this bot")
        .setDescriptionLocalizations(global.COMMAND_META[name].description),
    async execute(interaction) {
        var embed = new EmbedBuilder()
            .setTitle(interaction.guild ? interaction.translation["embed_title.guild"] : interaction.translation["embed_title.private"])
            .setColor(0x00ff00);

        var lang = interaction?.dbGuild?.language ?? interaction.locale;

        global.COMMANDS.filter(x => interaction?.guild || x.data.dm_permission != false)
            .sort((a, b) => a.data.name.localeCompare(b.data.name))
            .forEach((command) => {
                embed.addFields({ name: "/" + command.data.name, value: command.data?.description_localizations?.[lang] ?? command.data.description });
            });

        await interaction.reply({ embeds: [embed] });
    },
};
