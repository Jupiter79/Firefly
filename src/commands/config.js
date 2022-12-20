const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription("Change the config for this server")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName("welcome")
                .setDescription("Define a welcome-channel in which new users should be greeted")
                .addChannelOption(option =>
                    option
                        .setName("channel")
                        .setDescription("The channel in which new users should be greeted")
                        .addChannelTypes(ChannelType.GuildText)
                )
                .addBooleanOption(option =>
                    option
                        .setName("delete")
                        .setDescription("Delete the current welcome-channel")
                )
        ),
    async execute(interaction) {
        var subcommand = interaction.options.getSubcommand();

        if (subcommand == "welcome") {
            var channel = interaction.options.getChannel("channel");
            var _delete = interaction.options.getBoolean("delete");

            var guild = await prisma.guild.findUnique({
                where: { id: interaction.guild.id }
            })

            if (channel) {
                if (channel.id == guild.welcome_channel) return await interaction.reply({ content: "This is already the welcome channel!", ephemeral: true });

                await prisma.guild.update({ where: { id: interaction.guild.id }, data: { welcome_channel: channel.id } });
                await interaction.reply(`The welcome-channel has been successfully set to ${channel.toString()}`)
            } else if (_delete) {
                if (!guild?.welcome_channel) return await interaction.reply({ content: "There hasn't been defined a welcome-channel yet!", ephemeral: true });

                await prisma.guild.update({ where: { id: interaction.guild.id }, data: { welcome_channel: null } });
                await interaction.reply("The welcome-channel has been successfully deleted!");
            } else {
                if (!guild?.welcome_channel) return await interaction.reply("There's no defined welcome channel")

                interaction.guild.channels.fetch(guild.welcome_channel)
                    .then(async channel => {
                        await interaction.reply(`The current welcome-channel is ${channel.toString()}`)
                    })
                    .catch(async () => {
                        await prisma.guild.update({ where: { id: interaction.guild.id }, data: { welcome_channel: null } });
                        await interaction.reply("There's no defined welcome channel")
                    });
            }
        }
    },
};