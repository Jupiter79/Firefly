const fs = require('node:fs');

global.LANGUAGES = {};

const languageFiles = fs.readdirSync(__dirname + "/translations").filter(file => file.endsWith('.json'));

global.LANGUAGES.list = languageFiles.map(x => x.split(".")[0]);
languageFiles.forEach(langFile => {
    var name = langFile.split(".")[0];

    global.LANGUAGES[name] = require(__dirname + "/translations/" + langFile);
})