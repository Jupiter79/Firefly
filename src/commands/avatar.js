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
        ),
    async execute(interaction) {
        var avatarURL = interaction.options.getUser("target").displayAvatarURL({size: 2048, format: "jpg"});
        
        await interaction.reply(avatarURL);
    },
};