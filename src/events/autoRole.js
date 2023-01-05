const { Events } = require('discord.js');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const Database = require("../database/index.js");
module.exports = {
    event: Events.GuildMemberAdd,
    async handle(member) {
        
    }
}