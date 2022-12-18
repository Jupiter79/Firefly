var getTimeUntil = (date) => {
    var today = new Date();
    if (!(today.getDate() == date.getDate() && today.getMonth() == date.getMonth())) {

        var diff = date.getTime() - today.getTime();
        if (diff <= 0) return false;

        var yearsR = diff % (1000 * 60 * 60 * 24 * 365)
        var years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365))

        var monthsR = yearsR % (1000 * 60 * 60 * 24 * 30)
        var months = Math.floor(yearsR / (1000 * 60 * 60 * 24 * 30))

        var daysR = monthsR % (1000 * 60 * 60 * 24)
        var days = Math.floor(monthsR / (1000 * 60 * 60 * 24))

        var hoursR = daysR % (1000 * 60 * 60)
        var hours = Math.floor(daysR / (1000 * 60 * 60))

        var minutesR = hoursR % (1000 * 60)
        var minutes = Math.floor(hoursR / (1000 * 60))

        var seconds = Math.round(minutesR / 1000)


        var values = { Year: years, Month: months, Day: days, Hour: hours, Minute: minutes, Second: seconds }
        values = Object.entries(values).filter(x => x[1] != 0).map(entry => {
            const [key, value] = entry;

            if (value > 1) {
                return `${value} ${key}s`;
            } else {
                return `${value} ${key}`
            }
        })

        return [values, `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`];
    } else return [null, `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`];
}

var getNext = (day, month) => {
    month -= 1

    var now = new Date();

    if (new Date(now.getFullYear(), month, day).getTime() < now.getTime()) now.setFullYear(now.getFullYear() + 1);
    return new Date(now.getFullYear(), month, day)
}

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('countdown')
        .setDescription('Shows the remaining time until a specific date')
        .addStringOption(option =>
            option
                .setName("date")
                .setDescription("The date of which you want to see the remaining time")),
    async execute(interaction) {
        var inputDate = interaction.options.getString("date")?.split(".");

        if (inputDate) {
            var date = new Date(inputDate[2], inputDate[1] - 1, inputDate[0]);

            if (!(date instanceof Date && !isNaN(date))) return await interaction.reply({ content: `Invalid date entered! Please use the following format: \`DD.MM.YYYY\``, ephemeral: true })

            date = getTimeUntil(date);

            if (date == false) return await interaction.reply({ content: "Please enter a date in the future", ephemeral: true });

            var embed = new EmbedBuilder()
                .setTitle("Countdown")
                .setColor(0xffffff)
                .setTimestamp()
                .addFields(
                    { name: "Defined date", value: `\`${date[1]}\`` },
                    { name: "Time", value: `\`${date[0].join(", ")}\`` }
                )

            await interaction.reply({ embeds: [embed] });
        } else {
            var dates = [["🎄 Christmas", getNext(24, 12)], ["🎆 New Year", getNext(1, 1)], ["💝 Valentine's day", getNext(14, 2)], ["<:Cliffford:787949474143141888> Cliffford Birthday", getNext(28, 3)]];

            var embed = new EmbedBuilder()
                .setTitle("Default Countdowns")
                .setColor(0xffffff)
                .setTimestamp()

            dates.sort((a, b) => {
                var today = new Date();
                if (a[1].getDate() == today.getDate() && a[1].getMonth() == today.getMonth()) return -Infinity;
                if (b[1].getDate() == today.getDate() && b[1].getMonth() == today.getMonth()) return Infinity;
                return a[1].getTime() - b[1].getTime()
            }).forEach(date => {
                var time = getTimeUntil(date[1]);
                if (time[0] != null) {
                    embed.addFields({ name: `${date[0]} (${time[1]})`, value: `\`${time[0].join(", ")}\`` })
                } else embed.addFields({ name: `${date[0]} (${time[1]})`, value: `\`Today\`` });
            })

            await interaction.reply({ embeds: [embed] });
        }
    },
};