const fs = require('fs');

module.exports.handle = (req, res) => {
    var routeFiles = fs.readdirSync(__dirname + "/routes");
    var routes = {};

    routeFiles.forEach(routePath => {
        var route = require(__dirname + "/routes/" + routePath);

        routes[route.path] = route.init();
    });

    if (req.path == "/") {
        res.sendJson({ status: 200, msg: "Welcome to the Firefly API!" });
    }
    else if (routes[req.path]) {
        routes[req.path].init(req, res);
    }
}