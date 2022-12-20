const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription("Change the config for this server")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false)
        .addSubcommandGroup(subcommandgroup =>
            subcommandgroup.
                setName("welcome")
                .setDescription("Define a welcome-channel in which new users should be greeted")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("view")
                        .setDescription("Shows the current welcome channel")
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("define")
                        .setDescription("Define a channel in which new users should be greeted")
                        .addChannelOption(option =>
                            option
                                .setName("channel")
                                .setDescription("The channel in which new users should be greeted")
                                .addChannelTypes(ChannelType.GuildText)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("reset")
                        .setDescription("Resets the welcome channel so new users won't be greeted anymore")
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
                if (!guild?.welcome_channel) return await interaction.reply("There's no defined welcome channel")

                interaction.guild.channels.fetch(guild.welcome_channel)
                    .then(async channel => {
                        await interaction.reply(`The current welcome-channel is ${channel.toString()}`)
                    })
                    .catch(async () => {
                        await prisma.guild.update({ where: { id: interaction.guild.id }, data: { welcome_channel: null } });
                        await interaction.reply("There's no defined welcome channel")
                    });
            } else if (subcommand == "define") {
                var channel = interaction.options.getChannel("channel");

                if (channel.id == guild.welcome_channel) return await interaction.reply({ content: "This is already the welcome channel!", ephemeral: true });

                await prisma.guild.update({ where: { id: interaction.guild.id }, data: { welcome_channel: channel.id } });
                await interaction.reply(`The welcome-channel has been successfully set to ${channel.toString()}`)
            } else if (subcommand == "reset") {
                if (!guild?.welcome_channel) return await interaction.reply({ content: "There hasn't been defined a welcome-channel yet!", ephemeral: true });

                await prisma.guild.update({ where: { id: interaction.guild.id }, data: { welcome_channel: null } });
                await interaction.reply("The welcome-channel has been successfully deleted!");
            }
        }
    },
};