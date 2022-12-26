const translator = require('@parvineyvazov/json-translator');

require("../lang/index.js").init();

var createdLanguages = global.LANGUAGES.list;
var languages = global.VALID_LANGUAGES.map(x => x.value).filter(x => x != "en" && !createdLanguages.includes(x));

let i = 0;
var translate = () => {
    if (languages[i]) {
        translator.translateFile(__dirname + "/../lang/translations/default.json", translator.languages.English, [languages[i]]);
    } else {
        clearInterval(translate);
        console.log("FINISHED!");
        process.exit(1);
    }
    i++;
};

translate();
setInterval(translate, 1000 * 5);