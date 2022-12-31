const { Events } = require('discord.js');

const StringSimilarity = require("string-similarity");

module.exports = {
    event: Events.InteractionCreate,
    async handle(interaction) {
        if (interaction.isAutocomplete()) {
            var subcommandgroup = interaction.options.getSubcommandGroup();
            var subcommand = interaction.options.getSubcommand();

            if (interaction.commandName == "config" && subcommandgroup == "language" && subcommand == "set") {
                let userInputLanguage = interaction.options.getString("language");

                let matches = global.VALID_LANGUAGES.map(x => {
                    let nameComparison = StringSimilarity.compareTwoStrings(userInputLanguage, x.name);
                    let valueComparison = StringSimilarity.compareTwoStrings(userInputLanguage, x.value);
                    
                    let name = x.name.split(" ").slice(1).join(" ");

                    return [x.value, Math.max(nameComparison, valueComparison), name]
                })
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(x => {
                        return {name: x[2], value: x[0]};
                    })

                interaction.respond(matches);
            }
        }
    }
}