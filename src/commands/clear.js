const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const name = "clear";
module.exports = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription('Delete messages of a channel')
        .setDescriptionLocalizations(global.COMMAND_META[name].description)
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("The amount of messages you want to delete")
                .setDescriptionLocalizations(global.COMMAND_META[name]["amount.description"])
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
                    .reply(`Cleared ${messages.size} ${messages.size == 1 ? "message" : "messages"}! :bomb:`)
                    .then(() => setTimeout(() => interaction.deleteReply(), 3000));
            })
            .catch(() => interaction.reply({ content: interaction.translation.error, ephemeral: true }))
    },
};