const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

const name = "meme";
module.exports = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription("Generates a meme from the Internet")
        .setDescriptionLocalizations(global.COMMAND_META[name].description),
    async execute(interaction) {
        var response = await fetch("https://meme-api.com/gimme");
        var body = await response.json();

        let embed = new EmbedBuilder()
            .setAuthor({ name: body.title, url: body.postLink })
            .setColor(0xd400ff)
            .setImage(body.url)
            .setFooter({ text: interaction.translation.posted_by.replace("{{author}}", body.author) });

        interaction.reply({ embeds: [embed] });
    },
};
