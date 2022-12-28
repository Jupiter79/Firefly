var express = require('express');

module.exports = () => {
    var router = express.Router();

    router.use("/", express.static("web_html"));

    return router;
}