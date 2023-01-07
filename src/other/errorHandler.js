const Logger = require("../logger/index.js");

process.on('uncaughtException', function (err) {
    Logger.error(err, err.stack);
});