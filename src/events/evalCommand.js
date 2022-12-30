const { Events, EmbedBuilder } = require('discord.js');

//eslint-disable-next-line
let client = global.CLIENT;
module.exports = {
    event: Events.MessageCreate,
    async handle(message) {
        var messageArray = message.content.split(/\s+/g);
        var command = messageArray[0].toLowerCase();
        var args = messageArray.slice(1);

        if (command != "@eval") return;
        if (process.env.NODE_ENV != "development") return;
        if (message.author.id != process.env.OWNER) return;

        try {
            let codein = args.join(" ");
            let code = require("util").inspect(eval(codein, { depth: 0 }));

            let embed = new EmbedBuilder()
                .addFields(
                    { name: "Input", value: `\`\`\`js\n${codein}\`\`\`` },
                    { name: "Output", value: `\`\`\`js\n${code}\`\`\`` }
                )
                .setColor("#a0faa9")
                .setFooter({ text: `Eval succeed.` })
                .setTimestamp();

            message.reply({ embeds: [embed] });
        } catch (e) {
            let codein = args.join(" ");
            let embed = new EmbedBuilder()
                .addFields(
                    { name: "Input", value: `\`\`\`js\n${codein}\`\`\`` },
                    { name: "Output", value: `\`\`\`js\n${e}\`\`\`` }
                )
                .setColor("#fa5a67")
                .setFooter({ text: `Eval failed.` })
                .setTimestamp();

            message.reply({ embeds: [embed] });
        }

    }
}