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

    sendToLog(content) {
        this.client.guilds.fetch(this.guild)
            .then(guild =>
                guild.channels.fetch(this.channel).then(channel =>
                    channel.send(content)
                )
            )

    },

    newCommand(interaction) {
        if (interaction.user.id == process.env.LOGGER_IGNORE) return;

        var embed = new EmbedBuilder()
            .setTitle("Executed Command")
            .setColor(0x00ff00)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .addFields(
                { name: "Guild", value: `**ID**: ${interaction.guild.id}\n**Name**: ${interaction.guild.name}` },
                { name: "Command", value: `\`${interaction.toString()}\`` }
            )
            .setTimestamp();

        this.sendToLog({ embeds: [embed] })
    },

    async newServer(guild) {
        console.log(guild.id);
        console.log(guild.memberCount);
        console.log(guild.preferredLocale)
        var embed = new EmbedBuilder()
            .setTitle("New Guild")
            .setColor(0x20d4bf)
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() })

        await guild.fetchOwner().then(owner => {
            embed.addFields(
                { name: "Owner", value: owner.user.tag }
            )
        })

        embed.addFields(
            { name: "Members", value: guild.memberCount.toString(), inline: true },
            { name: "Preferred Language", value: guild.preferredLocale, inline: true },
            { name: "ID", value: guild.id }
        )
            .setTimestamp();

        this.sendToLog({ embeds: [embed] })
    }
}