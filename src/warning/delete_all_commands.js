require("dotenv").config({ path: "../.env" });

const { REST, Routes } = require('discord.js');

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);