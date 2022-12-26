const fs = require('node:fs');

global.LANGUAGES = {};

global.EVENT_META = {};
global.COMMAND_META = {};

global.VALID_LANGUAGES = [
    { name: "🇺🇸 English [DEFAULT]", value: "en" },
    { name: "🇮🇩 Indonesian (Bahasa Indonesia)", value: "id" },
    { name: "🇩🇰 Danish (Dansk)", value: "da" },
    { name: "🇩🇪 German (Deutsch)", value: "de" },
    { name: "🇪🇸 Spanish (Español)", value: "es-ES" },
    { name: "🇫🇷 French (Français)", value: "fr" },
    { name: "🇭🇷 Croatian (Hrvatski)", value: "hr" },
    { name: "🇮🇹 Italian (Italiano)", value: "it" },
    { name: "🇱🇹 Lithuanian (Lietuviškai)", value: "lt" },
    { name: "🇭🇺 Hungarian (Magyar)", value: "hu" },
    { name: "🇳🇱 Dutch (Nederlands)", value: "nl" },
    { name: "🇳🇴 Norwegian (Norsk)", value: "no" },
    { name: "🇵🇱 Polish (Polski)", value: "pl" },
    { name: "🇧🇷 Portuguese, Brazilian (Português do Brasil)", value: "pt-BR" },
    { name: "🇷🇴 Romanian, Romania (Română)", value: "ro" },
    { name: "🇫🇮 Finnish (Suomi)", value: "fi" },
    { name: "🇸🇪 Swedish (Svenska)", value: "sv-SE" },
    { name: "🇻🇳 Vietnamese (Tiếng Việt)", value: "vi" },
    { name: "🇹🇷 Turkish (Türkçe)", value: "tr" },
    { name: "🇨🇿 Czech (Čeština)", value: "cs" },
    { name: "🇬🇷 Greek (Ελληνικά)", value: "el" },
    { name: "🇧🇬 Bulgarian (български)", value: "bg" },
    { name: "🇷🇺 Russian (Pусский)", value: "ru" },
    { name: "🇺🇦 Ukrainian (Українська)", value: "uk" },
    { name: "🇮🇳 Hindi (हिन्दी)", value: "hi" },
    { name: "🇹🇭 Thai (ไทย)", value: "th" },
    { name: "🇨🇳 Chinese, China (中文)", value: "zh-CN" },
    { name: "🇯🇵 Japanese (日本語)", value: "ja" },
    { name: "🇹🇼 Chinese, Taiwan (繁體中文)", value: "zh-TW" },
    { name: "🇰🇷 Korean (한국어)", value: "ko" }
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

            var events = Object.entries(sLang.events);
            var commands = Object.entries(sLang.commands);

            events.forEach(event => {
                if (!global.EVENT_META[event[0]]) global.EVENT_META[event[0]] = {};

                global.EVENT_META[event[0]][lang] = event[1];
            })

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