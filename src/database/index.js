const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

module.exports = {
    async createGuild(guild) {
        await prisma.guild.create({
            data: { id: guild.id }
        })

        return this.fetchEntry();
    },
    async fetchEntry(guild) {
        return await prisma.guild.findUnique({
            where: { id: guild.id }
        }) 
    },
    async getGuild(interaction) {
        var entry = await this.fetchEntry(interaction.guild);

        if (!entry) entry = await this.createGuild(interaction.guild);

        return entry;
    }
}