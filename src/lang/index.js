const fs = require('node:fs');

global.LANGUAGES = {};
global.COMMAND_META = {};
global.VALID_LANGUAGES = [
    { name: "English [DEFAULT]", value: "en" },
    { name: "German (Deutsch)", value: "de" },
    { name: "French (Français)", value: "fr" },
    { name: "Dutch (Nederlands)", value: "nl" },
    { name: "Russian (Русский)", value: "ru" },
    { name: "Spanish (Español)", value: "es-ES" },
    { name: "Danish (Dansk)", value: "da" },
    { name: "Italian (Italiano)", value: "it" },
    { name: "Greek (Ελληνικά)", value: "el" },
    { name: "Bulgarian (български)", value: "bg" },
    { name: "Chinese China (中国中国)", value: "zh-CN" },
    { name: "Chinese Taiwan (中國中國)", value: "zh-TW" }
];

module.exports = {
    init() {
        const languageFiles = fs.readdirSync(__dirname + "/translations").filter(file => file.endsWith('.json'));

        global.LANGUAGES.list = languageFiles.map(x => x.split(".")[0]);
        languageFiles.forEach(langFile => {
            var name = langFile.split(".")[0];

            global.LANGUAGES[name] = require(__dirname + "/translations/" + langFile);
        })

        global.LANGUAGES.list.filter(x => x != "default").forEach(lang => {
            var sLang = global.LANGUAGES[lang];
            var commands = Object.entries(sLang.commands);

            commands.filter(x => Object.keys(x[1].meta).length > 0).forEach(command => {
                var metas = Object.entries(command[1].meta);
                if (!global.COMMAND_META[command[0]]) global.COMMAND_META[command[0]] = {}

                metas.filter(x => x.length > 0).forEach(meta => {
                    if (!global.COMMAND_META[command[0]][meta[0]]) global.COMMAND_META[command[0]][meta[0]] = {};

                    global.COMMAND_META[command[0]][meta[0]][lang] = meta[1];
                })
            })
        })
    },
    getUsedLanguage(interaction) {
        if (interaction.dbGuild) {
            let lang = interaction.dbGuild.language;

            return global.LANGUAGES[lang == "en" ? "default" : lang]
        } else {
            var usedLanguage = interaction.locale;

            return global.LANGUAGES.list.includes(usedLanguage) ? global.LANGUAGES[usedLanguage] : global.LANGUAGES["default"];
        }
    }
}