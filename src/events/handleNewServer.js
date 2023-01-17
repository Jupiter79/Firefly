const { Events, EmbedBuilder } = require('discord.js');

const Logger = require("../logger/index.js");

let client = global.CLIENT;
module.exports = {
    event: Events.GuildCreate,
    async handle(guild) {
        Logger.newServer(guild);

        var embed = new EmbedBuilder()
            .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
            .setDescription("Hey!\nI am **FireFly**, to see a full list of all my commands just use **/help**!\nTo change my language, use **/language**")
            .addFields(
                { name: "Support Server", value: "https://discord.gg/AwwWMGbBJH" }
            )
            .setColor(0x00a346)
            .setImage(client.user.displayAvatarURL({ size: 2048 }))
            .setTimestamp();

        if (guild.systemChannel) guild.systemChannel.send({ embeds: [embed] }).catch(() => {});
    }
}