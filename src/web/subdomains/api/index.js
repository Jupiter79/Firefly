const fs = require('fs');

module.exports.handle = (req, res) => {
    var routeFiles = fs.readdirSync(__dirname + "/routes");
    var routes = {};

    routeFiles.forEach(routePath => {
        var route = require(__dirname + "/routes/" + routePath);
        
        routes[route.path] = route.init();
    });

    console.log(res.path);

    res.send("WELCOME TO THE API");
}