const { Events } = require('discord.js');
const Language = require("../lang/index.js");

module.exports = {
    event: Events.InteractionCreate,
    async handle(interaction) {
        if (interaction.isAutocomplete()) {
            var subcommandgroup = interaction.options.getSubcommandGroup();
            var subcommand = interaction.options.getSubcommand();

            if (interaction.commandName == "config" && subcommandgroup == "language" && subcommand == "set") {
                let userInputLanguage = interaction.options.getString("language");

                let matches = Language.getBestSearchResults(userInputLanguage, 5);

                interaction.respond(matches);
            }
        }
    }
}