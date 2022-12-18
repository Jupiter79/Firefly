const fs = require('fs');

module.exports.handle = (req, res) => {
    var routeFiles = fs.readdirSync(__dirname + "/routes");
    var routes = {};

    routeFiles.forEach(routePath => {
        var route = require(__dirname + "/routes/" + routePath);

        routes[route.path] = route.init();
    });

    console.log(routes);

    if (req.path == "/") {
        res.json({ status: 200, msg: "Welcome to the Firefly API!" });
    }
    else if (routes[req.path]) {
        routes[req.path].init(req, res);
    }
    else {
        res.json({status: 404, msg: "Not found"});
    }
}