const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const name = "coinflip";
module.exports = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription('Flip a coin')
        .setDescriptionLocalizations(global.COMMAND_META[name].description)
        .addUserOption(option =>
            option
                .setName("opponent")
                .setDescription("The opponent you want to play against")
                .setDescriptionLocalizations(global.COMMAND_META[name]["opponent.description"])
        ),
    async execute(interaction) {
        var initiator = interaction.user;
        var opponent = interaction.options.getUser("opponent");

        var boolean = Math.random() < 0.5;

        var headsTailsImage = "src/assets/heads_tails.png";

        if (!opponent) {
            let embed = new EmbedBuilder()
                .setTitle(interaction.translation.name)
                .setColor(0xf2ba00)
                .setThumbnail("attachment://heads_tails.png")
                .addFields({ name: interaction.translation.result, value: boolean ? interaction.translation.heads : interaction.translation.tails })

            await interaction.reply({ embeds: [embed], files: [headsTailsImage] });
        } else {
            if (initiator == opponent) return interaction.reply({ content: interaction.translation.error, ephemeral: true });

            let embed = new EmbedBuilder()
                .setTitle(interaction.translation.name)
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
                .setThumbnail("attachment://heads_tails.png")

            await interaction.reply({ embeds: [embed], files: [headsTailsImage] });
        }
    },
};