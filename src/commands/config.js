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
            subcommandgroup
                .setName("language")
                .setDescription("View or change the language for this server")
                .setDescriptionLocalizations(global.COMMAND_META[name]["language.description"])
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("set")
                        .setDescription("Change the language for this server")
                        .setDescriptionLocalizations(global.COMMAND_META[name]["language.set.description"])
                        .addStringOption(option =>
                            option
                                .setName("language")
                                .setRequired(true)
                                .setDescription("The language you want the bot to speak in")
                                .setDescriptionLocalizations(global.COMMAND_META[name]["language.set.language.description"])
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("list")
                        .setDescription("View a list of all possible languages which this bot supports")
                        .setDescriptionLocalizations(global.COMMAND_META[name]["language.list.description"])
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("view")
                        .setDescription("Shows the current language")
                        .setDescriptionLocalizations(global.COMMAND_META[name]["language.view.description"])
                )
        )
        .addSubcommandGroup(subcommandgroup =>
            subcommandgroup.
                setName("welcome")
                .setDescription("Define a welcome-channel in which new users should be greeted")
                .setDescriptionLocalizations(global.COMMAND_META[name]["welcome.description"])
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("view")
                        .setDescription("Shows the current welcome channel")
                        .setDescriptionLocalizations(global.COMMAND_META[name]["welcome.view.description"])
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("define")
                        .setDescription("Define a channel in which new users should be greeted")
                        .setDescriptionLocalizations(global.COMMAND_META[name]["welcome.define.description"])
                        .addChannelOption(option =>
                            option
                                .setName("channel")
                                .setDescription("The channel in which new users should be greeted")
                                .setDescriptionLocalizations(global.COMMAND_META[name]["welcome.channel.description"])
                                .addChannelTypes(ChannelType.GuildText)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("reset")
                        .setDescription("Reset the welcome channel so new users won't be greeted anymore")
                        .setDescriptionLocalizations(global.COMMAND_META[name]["welcome.reset.description"])
                )
        )
        .addSubcommandGroup(subcommandgroup =>
            subcommandgroup.
                setName("counting")
                .setDescription("Define a counting (game) channel in which users can count up")
                .setDescriptionLocalizations(global.COMMAND_META[name]["counting.description"])
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("view")
                        .setDescription("Shows the current counting channel")
                        .setDescriptionLocalizations(global.COMMAND_META[name]["counting.view.description"])
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("define")
                        .setDescription("Define a counting channel where the counting game can be played")
                        .setDescriptionLocalizations(global.COMMAND_META[name]["counting.define.description"])
                        .addChannelOption(option =>
                            option
                                .setName("channel")
                                .setDescription("The channel in which users can count up")
                                .setDescriptionLocalizations(global.COMMAND_META[name]["counting.channel.description"])
                                .addChannelTypes(ChannelType.GuildText)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("reset")
                        .setDescription("Reset the counting game channel")
                        .setDescriptionLocalizations(global.COMMAND_META[name]["counting.reset.description"])
                )
        ),
    async execute(interaction) {
        var subcommandgroup = interaction.options.getSubcommandGroup();
        var subcommand = interaction.options.getSubcommand();

        var guild = await prisma.guild.findUnique({
            where: { id: interaction.guild.id }
        })

        if (subcommandgroup == "language") {
            if (subcommand == "set") {
                var language = interaction.options.getString("language");

                var languageName = global.VALID_LANGUAGES.find(x => x.value == language)?.name;

                if (languageName) {
                    if (language == guild.language) return interaction.reply({ content: interaction.translation["language.already"], ephemeral: true });
                    else {
                        await prisma.guild.update({
                            where: {
                                id: interaction.guild.id
                            },
                            data: {
                                language: language
                            }
                        });

                        await interaction.reply(interaction.translation["language.success_set"].replace("{{language}}", `\`${languageName}\``));
                    }
                } else await interaction.reply(interaction.translation["language.invalid_lang"])
            } else if (subcommand == "list") {
                await interaction.reply(global.VALID_LANGUAGES.map(x => `${x.name} => **${x.value}**`).join("\n"));
            } else if (subcommand == "view") {
                await interaction.reply(interaction.translation["language.current_lang"].replace("{{lang}}", global.VALID_LANGUAGES.find(x => x.value == interaction.dbGuild.language).name))
            }
        } else if (subcommandgroup == "welcome") {
            if (subcommand == "view") {
                if (!guild?.welcome_channel) return await interaction.reply(interaction.translation["welcome.no_defined"])

                interaction.guild.channels.fetch(guild.welcome_channel)
                    .then(async channel => {
                        await interaction.reply(interaction.translation["welcome.current_channel"].replace("{{channel}}", channel.toString()))
                    })
                    .catch(async () => {
                        await prisma.guild.update({ where: { id: interaction.guild.id }, data: { welcome_channel: null } });
                        await interaction.reply(interaction.translation["welcome.no_defined"])
                    });
            } else if (subcommand == "define") {
                let channel = interaction.options.getChannel("channel");

                if (channel.id == guild.welcome_channel) return await interaction.reply({ content: interaction.translation["welcome.already_defined"], ephemeral: true });

                await prisma.guild.update({ where: { id: interaction.guild.id }, data: { welcome_channel: channel.id } });
                await interaction.reply(interaction.translation["welcome.success_set"].replace("{{channel}}", channel.toString()))
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
                        await interaction.reply(interaction.translation["counting.current_channel"].replace("{{channel}}", channel.toString()))
                    })
                    .catch(async () => {
                        await prisma.guild.update({ where: { id: interaction.guild.id }, data: { counting_channel: null } });
                        await interaction.reply(interaction.translation["counting.no_defined"])
                    });
            } else if (subcommand == "define") {
                let channel = interaction.options.getChannel("channel");

                if (channel.id == guild.counting_channel) return await interaction.reply({ content: interaction.translation["counting.already_defined"], ephemeral: true });

                await prisma.guild.update({ where: { id: interaction.guild.id }, data: { counting_channel: channel.id } });
                await interaction.reply(interaction.translation["counting.success_set"].replace("{{channel}}", channel.toString()))
            } else if (subcommand == "reset") {
                if (!guild?.counting_channel) return await interaction.reply({ content: interaction.translation["counting.no_defined"], ephemeral: true });

                await prisma.guild.update({ where: { id: interaction.guild.id }, data: { counting_channel: null, counting_last_number: 0, counting_last_user: null } });
                await interaction.reply(interaction.translation["counting.success_reset"]);
            }
        }
    },
};