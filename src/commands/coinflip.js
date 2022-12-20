const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip a coin')
        .setDescriptionLocalizations({
            de: "Werfe eine Münze"
        })
        .addUserOption(option =>
            option
                .setName("opponent")
                .setNameLocalizations({
                    de: "gegner"
                })
                .setDescription("The user who you want to play against")
                .setDescriptionLocalizations({
                    de: "Der Gegner, gegen den du spielen möchtest"
                })
        ),
    async execute(interaction) {
        var initiator = interaction.user;
        var opponent = interaction.options.getUser("opponent");

        var boolean = Math.random() < 0.5;

        if (!opponent) {
            var embed = new EmbedBuilder()
                .setTitle("Coin Flip")
                .setColor(0xf2ba00)
                .addFields({ name: interaction.translation.result, value: boolean ? interaction.translation.heads : interaction.translation.tails })

            await interaction.reply({ embeds: [embed] });
        } else {
            if (initiator == opponent) return interaction.reply({ content: interaction.translation.error, ephemeral: true });

            var embed = new EmbedBuilder()
                .setTitle("Coin Flip")
                .setColor(0xf2ba00)
                .addFields(
                    {
                        name: interaction.translation.players,
                        value: `${initiator.toString()} (${interaction.translation.heads}) vs ${opponent.toString()} (${interaction.translation.tails})`
                    },
                    {
                        name: interaction.translation.winner,
                        value: boolean ? `${initiator.toString()} (${interaction.translation.heads})` : `${opponent.toString()} (${interaction.translation.tails})`
                    }
                )
                .setThumbnail(boolean ? initiator.displayAvatarURL() : opponent.displayAvatarURL())

            await interaction.reply({ embeds: [embed] });
        }
    },
};