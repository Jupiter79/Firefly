const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription("Change the config for this server")
        .setDescriptionLocalizations({
            de: "Passe die Einstellungen für diesen Server an"
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false)
        .addSubcommandGroup(subcommandgroup =>
            subcommandgroup.
                setName("welcome")
                .setNameLocalizations({
                    de: "willkommen"
                })
                .setDescription("Define a welcome-channel in which new users should be greeted")
                .setDescriptionLocalizations({
                    de: "Setze einen Willkommens-Channel, indem neue Benutzer gegrüßt werden"
                })
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("view")
                        .setNameLocalizations({
                            de: "anzeigen"
                        })
                        .setDescription("Shows the current welcome channel")
                        .setDescriptionLocalizations({
                            de: "Zeit den aktuellen Willkommens-Channel an"
                        })
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("define")
                        .setNameLocalizations({
                            de: "setzen"
                        })
                        .setDescription("Define a channel in which new users should be greeted")
                        .setDescriptionLocalizations({
                            de: "Setze einen Willkommens-Channel, indem neue Benutzer gegrüßt werden"
                        })
                        .addChannelOption(option =>
                            option
                                .setName("channel")
                                .setNameLocalizations({
                                    de: "kanal"
                                })
                                .setDescription("The channel in which new users should be greeted")
                                .setDescriptionLocalizations({
                                    de: "Der Kanal, in dem neue User begrüßt werden sollen"
                                })
                                .addChannelTypes(ChannelType.GuildText)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("reset")
                        .setNameLocalizations({
                            de: "zurücksetzen"
                        })
                        .setDescription("Resets the welcome channel so new users won't be greeted anymore")
                        .setDescriptionLocalizations({
                            de: "Setzt den Willkommens-Channel zurück, sodass keine neuen User gegrüßt werden"
                        })
                )
        ),
    async execute(interaction) {
        var subcommandgroup = interaction.options.getSubcommandGroup();
        var subcommand = interaction.options.getSubcommand();

        var guild = await prisma.guild.findUnique({
            where: { id: interaction.guild.id }
        })

        if (subcommandgroup == "welcome") {
            if (subcommand == "view") {
                if (!guild?.welcome_channel) return await interaction.reply(interactions.translation.no_defined)

                interaction.guild.channels.fetch(guild.welcome_channel)
                    .then(async channel => {
                        await interaction.reply(interactions.translation.current_channel.replace("%channel%", channel.toString()))
                    })
                    .catch(async () => {
                        await prisma.guild.update({ where: { id: interaction.guild.id }, data: { welcome_channel: null } });
                        await interaction.reply(interactions.translation.no_defined)
                    });
            } else if (subcommand == "define") {
                var channel = interaction.options.getChannel("channel");

                if (channel.id == guild.welcome_channel) return await interaction.reply({ content: interaction.translation.already_defined, ephemeral: true });

                await prisma.guild.update({ where: { id: interaction.guild.id }, data: { welcome_channel: channel.id } });
                await interaction.reply(interaction.translation.success_set.replace("%channel%", channel.toString()))
            } else if (subcommand == "reset") {
                if (!guild?.welcome_channel) return await interaction.reply({ content: interaction.translation.no_defined, ephemeral: true });

                await prisma.guild.update({ where: { id: interaction.guild.id }, data: { welcome_channel: null } });
                await interaction.reply(interaction.translation.success_reset);
            }
        }
    },
};