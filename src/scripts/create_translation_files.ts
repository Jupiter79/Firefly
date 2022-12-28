import { translateFile, languages as _languages } from '@parvineyvazov/json-translator';

require("../lang/index.js").init();

var createdLanguages = global.LANGUAGES.list;
var languages = global.VALID_LANGUAGES.map((x: any) => x.value).filter((x: any) => x != "en" && !createdLanguages.includes(x));

let i = 0;
var translate: any = () => {
    if (languages[i]) {
        translateFile(__dirname + "/../lang/translations/default.json", _languages.English, [languages[i]]);
    } else {
        clearInterval(translate);
        console.log("FINISHED!");
        process.exit(1);
    }
    i++;
};

translate();
setInterval(translate, 1000 * 5);