const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear messages of a channel')
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("The amount of messages you want to clear")
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),
    async execute(interaction) {
        var channel = interaction.channel;
        var amount = interaction.options.getInteger("amount");

        channel.bulkDelete(amount)
            .then(async messages => {
                await interaction
                    .reply({ content: `Cleared ${messages.size} ${messages.size == 1 ? "message" : "messages"}!`, ephemeral: true })
                    .then(x => setTimeout(() => interaction.deleteReply(), 3000));
            })
            .catch(err => interaction.reply({ content: "The messages are older than 14 days, thus they cannot be deleted", ephemeral: true }))
    },
};