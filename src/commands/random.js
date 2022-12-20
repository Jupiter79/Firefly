const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setNameLocalizations({
            de: "zufall"
        })
        .setDescription('Sends a random thing of what you defined')
        .setDescriptionLocalizations({
            de: "Sendet dir eine zufällgige Sache aus, die ausgewählt werden kann"
        })
        .addStringOption(option =>
            option
                .setName("type")
                .setNameLocalizations({
                    de: "typ"
                })
                .setDescription("The thing you want to randomize")
                .setDescriptionLocalizations({
                    de: "Die Sache, von der du ein zufälliges Element bekommen möchtest"
                })
                .addChoices(
                    { name: "Random member of this server", value: "members" },
                    { name: "Random channel of this server", value: "channels" },
                    { name: "Random role of this server", value: "roles" },
                    { name: "Yes or No", value: "yesno" }
                )
                .setRequired(true)
        )
        .setDMPermission(false),
    async execute(interaction) {
        var type = interaction.options.getString("type");

        if (type != "yesno") {
            var chosen = (type != "role" ? interaction.guild[type].cache : interaction.guild.roles.cache.filter(x => x.name != "@everyone")).random().toString();

            await interaction.reply(chosen);
        } else {
            await interaction.reply(interaction.translation.answer.replace("%answer%", Math.random() < 0.5 ? "Yes" : "No"))
        }
    },
};