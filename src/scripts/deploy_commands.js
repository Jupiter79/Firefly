require("dotenv").config();

require("../lang/index.js").init();

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');

const commands = [];
const commandFiles = fs.readdirSync('src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    commands.push({ data: command.data.toJSON(), guild: command.guild });
}

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        let globalCommands = commands.filter(x => !x.guild).map(x => x.data);
        let guildCommands = commands.filter(x => x.guild);

        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: globalCommands },
        );

        guildCommands.forEach(async command => {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, command.guild),
                { body: [command.data] },
            );
        })

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();