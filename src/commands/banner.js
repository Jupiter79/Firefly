const { SlashCommandBuilder } = require('discord.js');

const name = "banner";
module.exports = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription('Show the banner of an user')
        .setDescriptionLocalizations(global.COMMAND_META[name].description)
        .addUserOption(option =>
            option
                .setName("target")
                .setDescription("The user which you want to show the banner of")
                .setDescriptionLocalizations(global.COMMAND_META[name].target)
                .setRequired(true)
        ),
    async execute(interaction) {
        var user = await interaction.options.getUser("target").fetch();
        var bannerURL = user.bannerURL({ size: 2048 });

        if (bannerURL) {
            await interaction.reply(bannerURL);
        } else await interaction.reply({ content: interaction.translation.no_banner, ephemeral: true })
    },
};