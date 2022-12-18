const fs = require('fs');
var express = require('express');
var router = express.Router();

var routeFiles = fs.readdirSync(__dirname + "/routes");
var routes = {};

routeFiles.forEach(routePath => {
    var route = require(__dirname + "/routes/" + routePath);

    routes[route.path] = {method: route.method, init: route.init,}
});

router.use("/", (req, res, next) => {
    if (req.path == "/") {
        res.json({ status: 200, msg: "Welcome to the Firefly API!" });
    }
    else if (routes[req.path]) {
        next();
    }
    else {
        res.json({ status: 404, msg: "Not found" });
    }
})

router.use("/", (req, res) => {
    var route = routes[req.path];
    var method = req.method;

    if (route.method == method) {
        route.init(req, res)
    }
})