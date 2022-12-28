import { ChatInputCommandInteraction, Guild } from "discord.js";

const { EmbedBuilder } = require("discord.js");

module.exports = {
  guild: null,
  channel: null,

  init() {
    this.guild = process.env.LOGGER_GUILD;
    this.channel = process.env.LOGGER_CHANNEL;
  },

  sendToLog(content: any) {
    global.CLIENT.guilds.fetch(this.guild).then((guild) =>
      guild.channels.fetch(this.channel).then((channel: any) => {
        if (channel != null) channel.send(content);
      })
    );
  },

  newCommand(interaction: ChatInputCommandInteraction) {
    if (interaction.user.id == process.env.OWNER) return;

    var langCode = interaction.dbGuild?.language ?? interaction.locale;
    var language = global.VALID_LANGUAGES.find(
      (x: any) => x.value == langCode
    ).name;

    if (interaction.guild != null) {
      var embed = new EmbedBuilder()
        .setTitle("Executed Command")
        .setColor(0x00ff00)
        .setAuthor({
          name: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .addFields(
          {
            name: "Guild",
            value: `**ID**: ${interaction.guild.id}\n**Name**: ${interaction.guild.name}`,
          },
          { name: "Command", value: `\`${interaction.toString()}\`` },
          { name: "Language", value: `\`${language}\`` }
        )
        .setTimestamp();

      this.sendToLog({ embeds: [embed] });
    }
  },

  async newServer(guild: Guild) {
    var embed = new EmbedBuilder()
      .setTitle("New Guild")
      .setColor(0x20d4bf)
      .setAuthor({ name: guild.name, iconURL: guild.iconURL() });

    await guild.fetchOwner().then((owner) => {
      embed.addFields({ name: "Owner", value: owner.user.tag });
    });

    embed
      .addFields(
        { name: "Members", value: guild.memberCount.toString(), inline: true },
        {
          name: "Preferred Language",
          value: guild.preferredLocale,
          inline: true,
        },
        { name: "ID", value: guild.id }
      )
      .setTimestamp();

    this.sendToLog({ embeds: [embed] });
  },
};
