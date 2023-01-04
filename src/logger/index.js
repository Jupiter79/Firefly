const { EmbedBuilder } = require('discord.js');

module.exports = {
    guild: null,
    channel: null,

    init() {
        this.guild = process.env.LOGGER_GUILD;
        this.channel = process.env.LOGGER_CHANNEL;
    },
    sendToLog(content) {
        global.CLIENT.guilds.fetch(this.guild)
            .then(guild =>
                guild.channels.fetch(this.channel).then(channel =>
                    channel.send(content)
                )
            )

    },
    newCommand(interaction) {
        if (interaction.user.id == process.env.OWNER) return;

        var langCode = interaction.dbGuild?.language ?? interaction.locale;
        var language = global.VALID_LANGUAGES.find(x => x.value == langCode).name;

        var embed = new EmbedBuilder()
            .setTitle(`Executed Command (${interaction.guild ? "Guild" : "Private"})`)
            .setColor(0x20d4bf)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

        if (interaction.guild) embed.addFields({ name: "Guild", value: `**ID**: ${interaction.guild.id}\n**Name**: ${interaction.guild.name}` });

        embed.addFields(
            { name: "Command", value: `\`${interaction.toString()}\`` },
            { name: "Language", value: `\`${language}\`` }
        )
            .setTimestamp();

        this.sendToLog({ embeds: [embed] })
    },
    async newServer(guild) {
        var embed = new EmbedBuilder()
            .setTitle("Joined Guild")
            .setColor(0x13e000)
            .setAuthor({ name: guild.name })

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
    },
    async leftServer(guild) {
        var embed = new EmbedBuilder()
            .setTitle("Left Guild")
            .setColor(0x8c0900)
            .setAuthor({ name: guild.name })

        await global.CLIENT.users.fetch(guild.ownerId).then(owner => {
            embed.addFields(
                { name: "Owner", value: owner.tag }
            )
        }).catch();

        embed.addFields(
            { name: "Members", value: guild.memberCount.toString(), inline: true },
            { name: "Preferred Language", value: guild.preferredLocale, inline: true },
            { name: "ID", value: guild.id }
        )
            .setTimestamp();

        this.sendToLog({ embeds: [embed] })
    }
}