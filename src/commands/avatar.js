const { SlashCommandBuilder } = require('discord.js');

const name = "avatar";
module.exports = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription('Shows you the avatar of someone')
        .setDescriptionLocalizations(global.COMMAND_META[name].description)
        .addUserOption(option =>
            option
                .setName("target")
                .setDescription("The user of which you want to show the avatar")
                .setDescriptionLocalizations(global.COMMAND_META[name].target)
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("extension")
                .setNameLocalizations(global.COMMAND_META[name].extension)
                .setDescription("The format in which you want to show the avatar")
                .setDescriptionLocalizations(global.COMMAND_META[name]["extension.description"])
                .addChoices(
                    { name: "PNG", value: "jpg" },
                    { name: "JPG", value: "jpg" },
                    { name: "GIF", value: "gif" },
                    { name: "WEBP", value: "webp" },
                    { name: "JPEG", value: "jpeg" }
                )
        ),
    async execute(interaction) {
        var extension = interaction.options.getString("extension") ?? "png";
        var avatarURL = interaction.options.getUser("target").displayAvatarURL({ size: 2048, extension: extension });

        await interaction.reply(avatarURL);
    },
};