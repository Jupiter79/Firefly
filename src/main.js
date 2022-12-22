require("dotenv").config();

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const intents = [GatewayIntentBits.Guilds];
if (process.env.NODE_ENV != "development") intents.push(GatewayIntentBits.GuildMembers);

const client = new Client({ intents: intents });

require("./lang/index.js").init();
require("./web/index.js");
require("./logger/index.js").init(client);

client.events = new Collection();
client.commands = new Collection();

const eventsPath = path.join(__dirname, 'events');
const eventsFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));


for (const file of eventsFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if ('event' in event && 'handle' in event) {
        client.events.set(event.event, event);
    } else {
        console.log(`[WARNING] The event at ${filePath} is missing a required "event" or "handle" property.`);
    }
}

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// HANDLE ALL EVENTS
client.events.forEach(event => {
    client.on(event.event, (...args) => event.handle(...args));
})

client.login(process.env.BOT_TOKEN);