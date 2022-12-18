const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Shows you the avatar of someone')
        .addUserOption(option =>
            option
                .setName("target")
                .setDescription("The user of which you want to show the avatar")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("extension")
                .setDescription("The format in which you want to show the avatar")
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