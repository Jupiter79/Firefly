const { EmbedBuilder } = require('discord.js');

module.exports = {
    client: null,
    guild: null,
    channel: null,

    init(client) {
        this.client = client;

        this.guild = process.env.LOGGER_GUILD;
        this.channel = process.env.LOGGER_CHANNEL;
    },

    newCommand(interaction) {
        if (interaction.user.id == process.env.LOGGER_IGNORE) return;

        this.client.guilds.fetch(this.guild)
            .then(guild =>
                guild.channels.fetch(this.channel).then(channel => {
                    var embed = new EmbedBuilder()
                        .setTitle("Executed Command")
                        .setColor(0x00ff00)
                        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                        .addFields(
                            { name: "Guild", value: `**ID**: ${interaction.guild.id}\n**Name**: ${interaction.guild.name}` },
                            { name: "Command", value: `\`${interaction.toString()}\`` }
                        )
                        .setTimestamp();

                    channel.send({ embeds: [embed] });
                })
            )
    },
}