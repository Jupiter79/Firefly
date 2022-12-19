const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage, registerFont } = require('canvas');

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

    ctx.font = `${image ? 45 : 47}px 'EB Garamond'`;

    var lines = Math.ceil(text.length / CONFIG.text.charactersperline);
    var totalHeight = (lines - 2) * CONFIG.text.lineheight;

    for (var i = 0; i < lines; i++) {
        ctx.fillText(`${i == 0 ? '"' : ''}${text.substr(i * CONFIG.text.charactersperline, CONFIG.text.charactersperline)}${i == lines - 1 ? '"' : ''}`, CONFIG.width / 2, (image ? CONFIG.height / 3 * 2 : CONFIG.height / 5 * 3) + i * CONFIG.text.lineheight - totalHeight / 2);
    }

    return canvas.toBuffer();
}

const VALID_URL = /(https?:\/\/.*\.(?:png|jpg|gif|SVG))/i;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Generates a image with a quote')
        .addSubcommand(subcommand =>
            subcommand
                .setName("user")
                .setDescription("Generates a quote from a Discord user")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("The author of the quote")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("text")
                        .setDescription("The text of the quote")
                        .setRequired(true)
                        .setMaxLength(CONFIG.text.maxchars)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("person")
                .setDescription("Generates a quote from a real person")
                .addStringOption(option =>
                    option
                        .setName("person")
                        .setDescription("The name of that person")
                        .setMaxLength(30)
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("text")
                        .setDescription("The text of the quote")
                        .setRequired(true)
                        .setMaxLength(CONFIG.text.maxchars)
                )
                .addStringOption(option =>
                    option.setName("image")
                        .setDescription("The URL of the image you want to use for this quote")
                )
        )
    ,
    async execute(interaction) {
        var subcommand = interaction.options.getSubcommand();

        if (subcommand == "user") {
            var user = interaction.options.getUser("user");
            var avatar = user.displayAvatarURL({ size: 2048, extension: "png" });
            var text = interaction.options.getString("text");

            const attachment = new AttachmentBuilder(await makeQuote(user.tag, text, avatar), { name: 'quote.png' })

            await interaction.reply({ files: [attachment] })
        } else if (subcommand == "person") {
            var person = interaction.options.getString("person");
            var text = interaction.options.getString("text");
            var image = interaction.options.getString("image");

            if (image && !VALID_URL.test(image)) return await interaction.reply({ content: "Only PNG, JPG and GIF image linsk are valid!", ephemeral: true });

            var quote = await makeQuote(person, text, image);

            if (!quote) return await interaction.reply({ content: "Cannot get image!", ephemeral: true });

            const attachment = new AttachmentBuilder(quote, { name: 'quote.png' })

            await interaction.reply({ files: [attachment] })
        }
    },
};