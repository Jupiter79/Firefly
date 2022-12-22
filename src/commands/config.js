const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const name = "config";
module.exports = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription("Change the config of the bot for this server")
        .setDescriptionLocalizations(global.COMMAND_META[name].description)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false)
        .addSubcommandGroup(subcommandgroup =>
            subcommandgroup.
                setName("welcome")
                .setNameLocalizations(global.COMMAND_META[name].welcome)
                .setDescription("Define a welcome-channel in which new users should be greeted")
                .setDescriptionLocalizations(global.COMMAND_META[name]["welcome.description"])
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("view")
                        .setNameLocalizations(global.COMMAND_META[name].view)
                        .setDescription("Shows the current welcome channel")
                        .setDescriptionLocalizations(global.COMMAND_META[name]["view.description"])
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("define")
                        .setNameLocalizations(global.COMMAND_META[name].define)
                        .setDescription("Define a channel in which new users should be greeted")
                        .setDescriptionLocalizations(global.COMMAND_META[name]["define.description"])
                        .addChannelOption(option =>
                            option
                                .setName("channel")
                                .setNameLocalizations(global.COMMAND_META[name].channel)
                                .setDescription("The channel in which new users should be greeted")
                                .setDescriptionLocalizations(global.COMMAND_META[name]["channel.description"])
                                .addChannelTypes(ChannelType.GuildText)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("reset")
                        .setNameLocalizations(global.COMMAND_META[name].reset)
                        .setDescription("Resets the welcome channel so new users won't be greeted anymore")
                        .setDescriptionLocalizations(global.COMMAND_META[name]["reset.description"])
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
                if (!guild?.welcome_channel) return await interaction.reply(interaction.translation.no_defined)

                interaction.guild.channels.fetch(guild.welcome_channel)
                    .then(async channel => {
                        await interaction.reply(interaction.translation.current_channel.replace("%channel%", channel.toString()))
                    })
                    .catch(async () => {
                        await prisma.guild.update({ where: { id: interaction.guild.id }, data: { welcome_channel: null } });
                        await interaction.reply(interaction.translation.no_defined)
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