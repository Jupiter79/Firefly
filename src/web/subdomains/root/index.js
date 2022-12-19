var express = require('express');

module.exports = () => {
    var router = express.Router();

    router.get("/", (req, res) => res.send("Welcome to Firefly!"));

    return router;
}