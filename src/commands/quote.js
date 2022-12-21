const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage, registerFont } = require('canvas');
const fetch = require("node-fetch");

const CONFIG = {
    width: 1000,
    height: 630,
    avatar: {
        size: 175,
        margin_top: 30
    },
    text: {
        lineheight: 45,
        charactersperline: 48,
        maxchars: 250
    }
}

registerFont("src/assets/EBGaramond-VariableFont_wght.ttf", { family: "EB Garamond" });

async function makeQuote(author, text, image) {
    const canvas = createCanvas(CONFIG.width, CONFIG.height)
    const ctx = canvas.getContext('2d');

    var pullUp = !image ? CONFIG.height / 2 - (CONFIG.height / 3) : 0;

    ctx.fillStyle = "#191919";
    ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "white";
    ctx.font = `${image ? 50 : 67}px Arial`;
    ctx.fillText(author, CONFIG.width / 2, CONFIG.height / 2 - 50 - pullUp);

    if (image) {
        try {
            var image = await loadImage(image);
        } catch (e) {
            return false;
        }

        ctx.save();

        ctx.beginPath();
        ctx.arc(CONFIG.width / 2, CONFIG.avatar.margin_top + CONFIG.avatar.size / 2, CONFIG.avatar.size * 0.5, 0, 2 * Math.PI, false);

        ctx.clip();

        ctx.drawImage(image, CONFIG.width / 2 - (CONFIG.avatar.size / 2), CONFIG.avatar.margin_top, CONFIG.avatar.size, CONFIG.avatar.size)

        ctx.restore();
    }

    ctx.font = `45px 'EB Garamond'`;

    var lines = Math.ceil(text.length / CONFIG.text.charactersperline);
    var totalHeight = (lines - 2) * CONFIG.text.lineheight;

    for (var i = 0; i < lines; i++) {
        var breakat = text.lastIndexOf(" ", (i + 1) * CONFIG.text.charactersperline) + 1;

        ctx.fillText(`${i == 0 ? '"' : ''}${text.substr(0, i == lines - 1 ? text.length : breakat)}${i == lines - 1 ? '"' : ''}`, CONFIG.width / 2, (image ? CONFIG.height / 3 * 2 : CONFIG.height / 5 * 3) + i * CONFIG.text.lineheight - totalHeight / 2);

        text = text.substring(breakat);
    }

    return canvas.toBuffer();
}

const VALID_URL = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/

const name = "quote";
module.exports = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setNameLocalizations(global.COMMAND_META[name].name)
        .setDescription('Generates a image with a quote')
        .setDescriptionLocalizations(global.COMMAND_META[name].description)
        .addSubcommand(subcommand =>
            subcommand
                .setName("user")
                .setNameLocalizations(global.COMMAND_META[name].user)
                .setDescription("Generates a quote from a Discord user")
                .setDescriptionLocalizations(global.COMMAND_META[name]["user.description"])
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("The author of the quote")
                        .setDescriptionLocalizations(global.COMMAND_META[name]["user.user.description"])
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("text")
                        .setDescription("The text of the quote")
                        .setDescriptionLocalizations(global.COMMAND_META[name]["user.text.description"])
                        .setRequired(true)
                        .setMaxLength(CONFIG.text.maxchars)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("person")
                .setDescription("Generates a quote from a real person")
                .setDescriptionLocalizations(global.COMMAND_META[name]["person.description"])
                .addStringOption(option =>
                    option
                        .setName("person")
                        .setDescription("The name of that person")
                        .setDescriptionLocalizations(global.COMMAND_META[name]["person.person.description"])
                        .setMaxLength(30)
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("text")
                        .setDescription("The text of the quote")
                        .setDescriptionLocalizations(global.COMMAND_META[name]["person.text.description"])
                        .setRequired(true)
                        .setMaxLength(CONFIG.text.maxchars)
                )
                .addStringOption(option =>
                    option
                        .setName("image")
                        .setNameLocalizations(global.COMMAND_META[name]["person.image"])
                        .setDescription("The URL of the image you want to use for this quote")
                        .setDescriptionLocalizations(global.COMMAND_META[name]["person.image.description"])
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("random")
                .setNameLocalizations(global.COMMAND_META[name].random)
                .setDescription("Generates a random quote")
                .setDescriptionLocalizations(global.COMMAND_META[name]["random.description"])
        ),

    async execute(interaction) {
        var subcommand = interaction.options.getSubcommand();

        if (subcommand == "user") {
            var user = interaction.options.getUser("user");
            var avatar = user.displayAvatarURL({ size: 2048, extension: "png" });
            var text = interaction.options.getString("text");

            const attachment = new AttachmentBuilder(await makeQuote(user.tag, text, avatar), { name: interaction.translation.filename + '.png' })

            await interaction.reply({ files: [attachment] })
        } else if (subcommand == "person") {
            var person = interaction.options.getString("person");
            var text = interaction.options.getString("text");
            var image = interaction.options.getString("image");

            if (image && !VALID_URL.test(image)) return await interaction.reply({ content: interaction.translation.valid_formats.replace("%formats%", "PNG, JPG, GIF, SVG"), ephemeral: true });

            var quote = await makeQuote(person, text, image);

            if (!quote) return await interaction.reply({ content: interaction.translation.error_fetch_image, ephemeral: true });

            const attachment = new AttachmentBuilder(quote, { name: interaction.translation.filename + '.png' })

            await interaction.reply({ files: [attachment] })
        } else if (subcommand == "random") {
            var response = await fetch("https://api.quotable.io/random");
            var body = await response.json();


            if (body.authorSlug) {
                var quote = await makeQuote(body.author, body.content, `https://images.quotable.dev/profile/200/${body.authorSlug}.jpg`);

                const attachment = new AttachmentBuilder(quote, { name: interaction.translation.filename + '.png' })

                await interaction.reply({ files: [attachment] })
            } else await interaction.reply(interaction.translation.error);
        }
    },
};