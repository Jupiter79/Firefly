const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('Sends a random thing of what you defined')
        .addStringOption(option =>
            option
                .setName("type")
                .setDescription("The thing you want to randomize")
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
        console.log("Working!");
        var type = interaction.options.getString("type");

        if (type != "yesno") {
            var chosen = (type != "role" ? interaction.guild[type].cache : interaction.guild.roles.cache.filter(x => x.name != "@everyone")).random().toString();

            await interaction.reply(`The random ${type} is => ${chosen}`)
        } else {
            await interaction.reply(`The answer is: ${Math.random() < 0.5 ? "Yes" : "No"}`)
        }
    },
};