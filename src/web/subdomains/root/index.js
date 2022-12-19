var express = require('express');

module.exports = () => {
    var router = express.Router();

    router.all('/*', function(req, res, next) {
        res.sendFile('index.html', { root: "web_html" });
    });

    return router;
}