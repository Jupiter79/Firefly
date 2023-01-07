const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

module.exports = {
    async createGuild(guild) {
        await prisma.guild.create({
            data: { id: guild.id }
        })

        return this.fetchEntry(guild);
    },
    async fetchEntry(guild) {
        return await prisma.guild.findUnique({
            where: { id: guild.id }
        })
    },
    async getGuildFromInteraction(interaction) {
        var entry = await this.fetchEntry(interaction.guild);

        if (!entry) entry = await this.createGuild(interaction.guild);

        return entry;
    },
    async getGuild(guild) {
        var entry = await this.fetchEntry(guild);

        if (!entry) entry = await this.createGuild(guild);

        return entry;
    },
    async getGuildLanguage(guild, usDefault = false) {
        var entry = await this.fetchEntry(guild);

        if (!entry) entry = await this.createGuild(guild);

        return usDefault ? (entry.language == "en" ? "default" : entry.language) : entry.language;
    }
}