const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip a coin')
        .addUserOption(option =>
            option
                .setName("opponent")
                .setDescription("The user who you want to play against")
        ),
    async execute(interaction) {
        var initiator = interaction.user;
        var opponent = interaction.options.getUser("opponent");

        var boolean = Math.random() < 0.5;

        if (!opponent) {
            var embed = new EmbedBuilder()
                .setTitle("CoinFlip")
                .setColor(0xf2ba00)
                .addFields({ name: "Result", value: boolean ? "Heads" : "Tails" })

            await interaction.reply({ embeds: [embed] });
        } else {
            if (initiator == opponent) return interaction.reply({content: "You can't play against yourself!", ephemeral: true});

            var embed = new EmbedBuilder()
                .setTitle("CoinFlip")
                .setColor(0xf2ba00)
                .addFields(
                    {
                        name: "Players",
                        value: `${initiator.toString()} (Heads) vs ${opponent.toString()} (Tails)`
                    },
                    {
                        name: "Winner",
                        value: boolean ? `${initiator.toString()} (Heads)` : `${opponent.toString()} (Tails)`
                    }
                )
                .setThumbnail(boolean ? initiator.displayAvatarURL() : opponent.displayAvatarURL())

            await interaction.reply({ embeds: [embed] });
        }
    },
};