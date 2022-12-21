const fs = require('node:fs');

global.LANGUAGES = {};
global.COMMAND_META = {};

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