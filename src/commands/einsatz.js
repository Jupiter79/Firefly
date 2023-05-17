const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

const { createCanvas, loadImage } = require('canvas');

const name = "einsatz";

function getCurrentDateTime(withSeconds) {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Monate sind nullbasiert
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const dateTime = `${day}.${month}.${year} ${hours}:${minutes}` + (withSeconds ? `:${seconds}` : "");

    return dateTime;
}

const lineSpacing = 60;
async function makeEinsatzImage(alarmTyp, stichwort, feuerwehr_typ, feuerwehr, straße, ort, gemeinde) {
    let image = await loadImage("src/assets/Einsatz_blank.png");

    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0);

    ctx.fillStyle = "#6A6B6B";
    ctx.font = `48px Arial`;
    ctx.textBaseline = 'middle';
    ctx.fillText(getCurrentDateTime(false), 245, 197);

    ctx.fillStyle = "black";
    ctx.font = `50px Arial`;
    ctx.fillText(`${alarmTyp} für ${feuerwehr_typ} ${feuerwehr}`, 55, 315);
    ctx.fillText(`LAWZ Einsatzmeldung:`, 55, 315 + (lineSpacing * 1));
    ctx.fillText(stichwort.toUpperCase(), 55, 315 + (lineSpacing * 2));
    ctx.fillText(straße, 55, 315 + (lineSpacing * 3));
    ctx.fillText(`${ort} - ${gemeinde}`, 55, 315 + (lineSpacing * 4));
    ctx.fillText(getCurrentDateTime(true), 55, 315 + (lineSpacing * 5));

    return canvas.toBuffer();
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription('Generiert einen Einsatz')
        .addStringOption(option =>
            option
                .setName("alarmtyp")
                .setDescription("Wie alarmiert werden soll")
                .addChoices(
                    { name: "Stiller Alarm", value: "Stiller Alarm" },
                    { name: "Sirenenalarm", value: "Sirenenalarm" }
                )
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("stichwort")
                .setDescription("Mit welchem Stichwort alarmiert werden soll")
                .setMaxLength(20)
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("feuerwehr_typ")
                .setDescription("Welche Art von Feuerwehr alarmiert werden soll")
                .setRequired(true)
                .addChoices(
                    { name: "Freiwillige Feuerwehr", value: "FF" },
                    { name: "Berufsfeuerwehr", value: "BF" },
                    { name: "Betriebsfeuerwehr", value: "BTF" }
                )
        )
        .addStringOption(option =>
            option
                .setName("feuerwehr")
                .setDescription("Welche Feuerwehr alarmiert werden soll (ohne FF, BF oder BTF!)")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("straße")
                .setDescription("Die Straße, wo der Einsatz ist")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("ort")
                .setDescription("Der Ort, wo der Einsatz ist")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("gemeinde")
                .setDescription("Die Gemeinde, wo der Einsatz ist")
                .setRequired(true)
        )
    ,
    async execute(interaction) {
        let image = await makeEinsatzImage(
            interaction.options.getString("alarmtyp"),
            interaction.options.getString("stichwort"),
            interaction.options.getString("feuerwehr_typ"),
            interaction.options.getString("feuerwehr"),
            interaction.options.getString("straße"),
            interaction.options.getString("ort"),
            interaction.options.getString("gemeinde"),
        );
        const attachment = new AttachmentBuilder(image, { name: 'einsatz.png' })

        let feuerwehr = interaction.options.getString("feuerwehr");
        let feuerwehr_typ = interaction.options.getString("feuerwehr_typ");
        let stichwort = interaction.options.getString("stichwort");

        if (feuerwehr_typ == "FF") feuerwehr_typ = "Feuerwehr";
        else if (feuerwehr_typ == "BTF") feuerwehr_typ = "Betriebsfeuerwehr";
        else if (feuerwehr_typ == "BF") feuerwehr_typ = "Berufsfeuerwehr";

        if (stichwort.startsWith("B") || stichwort.startsWith("F")) stichwort = "Brandeinsatz";
        else if (stichwort.startsWith("T")) stichwort = "Technischer Einsatz";
        else return interaction.reply({ content: "Ungültiges Stichwort! Muss mit **B**, **T**, oder **F** starten!", ephemeral: true })

        let message = await interaction.reply({ content: `<@1062628839408275476>\n**Hier LAWZ Einsatzmeldung für die ${feuerwehr_typ} ${feuerwehr} ${stichwort} ENDE**`, files: [attachment], fetchReply: true });

        await message.react("✅");
        await message.react("❌");
    },
    guild: "1037102790197125212"
};