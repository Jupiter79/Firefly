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
        .addSubcommand(subcommand =>
            subcommand
                .setName("language")
                .setDescription("Change the language of the bot for this server")
                .addStringOption(option => {
                    option
                        .setName("language")
                        .setDescription("The language you want to set for this server")
                        .setRequired(true)

                    global.VALID_LANGUAGES.forEach(lang => option.addChoices({ name: lang.name, value: lang.value }));

                    return option;
                })
        )
        .addSubcommandGroup(subcommandgroup =>
            subcommandgroup.
                setName("welcome")
                .setNameLocalizations(global.COMMAND_META[name].welcome)
                .setDescription("Define a welcome-channel in which new users should be greeted")
                .setDescriptionLocalizations(global.COMMAND_META[name]["welcome.description"])
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("view")
                        .setNameLocalizations(global.COMMAND_META[name]["welcome.view"])
                        .setDescription("Shows the current welcome channel")
                        .setDescriptionLocalizations(global.COMMAND_META[name]["welcome.view.description"])
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("define")
                        .setNameLocalizations(global.COMMAND_META[name]["welcome.define"])
                        .setDescription("Define a channel in which new users should be greeted")
                        .setDescriptionLocalizations(global.COMMAND_META[name]["welcome.define.description"])
                        .addChannelOption(option =>
                            option
                                .setName("channel")
                                .setNameLocalizations(global.COMMAND_META[name]["welcome.channel"])
                                .setDescription("The channel in which new users should be greeted")
                                .setDescriptionLocalizations(global.COMMAND_META[name]["welcome.channel.description"])
                                .addChannelTypes(ChannelType.GuildText)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("reset")
                        .setNameLocalizations(global.COMMAND_META[name]["welcome.reset"])
                        .setDescription("Resets the welcome channel so new users won't be greeted anymore")
                        .setDescriptionLocalizations(global.COMMAND_META[name]["welcome.reset.description"])
                )
        )
        .addSubcommandGroup(subcommandgroup =>
            subcommandgroup.
                setName("counting")
                .setNameLocalizations(global.COMMAND_META[name].counting)
                .setDescription("Define a counting (game) channel in which users can count up")
                .setDescriptionLocalizations(global.COMMAND_META[name]["counting.description"])
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("view")
                        .setNameLocalizations(global.COMMAND_META[name]["counting.view"])
                        .setDescription("Shows the current counting channel")
                        .setDescriptionLocalizations(global.COMMAND_META[name]["counting.view.description"])
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("define")
                        .setNameLocalizations(global.COMMAND_META[name]["counting.define"])
                        .setDescription("Define a counting channel where the counting game can be played")
                        .setDescriptionLocalizations(global.COMMAND_META[name]["counting.define.description"])
                        .addChannelOption(option =>
                            option
                                .setName("channel")
                                .setNameLocalizations(global.COMMAND_META[name]["counting.channel"])
                                .setDescription("The channel in which users can count up")
                                .setDescriptionLocalizations(global.COMMAND_META[name]["counting.channel.description"])
                                .addChannelTypes(ChannelType.GuildText)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("reset")
                        .setNameLocalizations(global.COMMAND_META[name]["counting.reset"])
                        .setDescription("Resets the counting game channel")
                        .setDescriptionLocalizations(global.COMMAND_META[name]["counting.reset.description"])
                )
        ),
    async execute(interaction) {
        var subcommandgroup = interaction.options.getSubcommandGroup();
        var subcommand = interaction.options.getSubcommand();

        var guild = await prisma.guild.findUnique({
            where: { id: interaction.guild.id }
        })

        if (subcommand == "language") {
            var language = interaction.options.getString("language");
            var languageName = global.VALID_LANGUAGES.find(x => x.value == language).name;

            if (language == guild.language) return interaction.reply({ content: "This is already the language!", ephemeral: true });
            else {
                await prisma.guild.update({
                    where: {
                        id: interaction.guild.id
                    },
                    data: {
                        language: language
                    }
                });

                await interaction.reply({ content: `The language has been successfully set to \`${languageName}\`` });
            }
        } else if (subcommandgroup == "welcome") {
            if (subcommand == "view") {
                if (!guild?.welcome_channel) return await interaction.reply(interaction.translation["welcome.no_defined"])

                interaction.guild.channels.fetch(guild.welcome_channel)
                    .then(async channel => {
                        await interaction.reply(interaction.translation["welcome.current_channel"].replace("%channel%", channel.toString()))
                    })
                    .catch(async () => {
                        await prisma.guild.update({ where: { id: interaction.guild.id }, data: { welcome_channel: null } });
                        await interaction.reply(interaction.translation["welcome.no_defined"])
                    });
            } else if (subcommand == "define") {
                var channel = interaction.options.getChannel("channel");

                if (channel.id == guild.welcome_channel) return await interaction.reply({ content: interaction.translation["welcome.already_defined"], ephemeral: true });

                await prisma.guild.update({ where: { id: interaction.guild.id }, data: { welcome_channel: channel.id } });
                await interaction.reply(interaction.translation["welcome.success_set"].replace("%channel%", channel.toString()))
            } else if (subcommand == "reset") {
                if (!guild?.welcome_channel) return await interaction.reply({ content: interaction.translation["welcome.no_defined"], ephemeral: true });

                await prisma.guild.update({ where: { id: interaction.guild.id }, data: { welcome_channel: null } });
                await interaction.reply(interaction.translation["welcome.success_reset"]);
            }
        } else if (subcommandgroup == "counting") {
            if (subcommand == "view") {
                if (!guild?.counting_channel) return await interaction.reply(interaction.translation["counting.no_defined"])

                interaction.guild.channels.fetch(guild.counting_channel)
                    .then(async channel => {
                        await interaction.reply(interaction.translation["counting.current_channel"].replace("%channel%", channel.toString()))
                    })
                    .catch(async () => {
                        await prisma.guild.update({ where: { id: interaction.guild.id }, data: { counting_channel: null } });
                        await interaction.reply(interaction.translation["counting.no_defined"])
                    });
            } else if (subcommand == "define") {
                var channel = interaction.options.getChannel("channel");

                if (channel.id == guild.counting_channel) return await interaction.reply({ content: interaction.translation["counting.already_defined"], ephemeral: true });

                await prisma.guild.update({ where: { id: interaction.guild.id }, data: { counting_channel: channel.id } });
                await interaction.reply(interaction.translation["counting.success_set"].replace("%channel%", channel.toString()))
            } else if (subcommand == "reset") {
                if (!guild?.counting_channel) return await interaction.reply({ content: interaction.translation["counting.no_defined"], ephemeral: true });

                await prisma.guild.update({ where: { id: interaction.guild.id }, data: { counting_channel: null, counting_last_number: 0, counting_last_user: null } });
                await interaction.reply(interaction.translation["counting.success_reset"]);
            }
        }
    },
};