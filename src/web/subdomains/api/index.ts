var express = require('express');

var routeFiles = fs.readdirSync(__dirname + "/routes");
var routes: any = {};

routeFiles.forEach((routePath: string) => {
    var route = require(__dirname + "/routes/" + routePath);

    routes[route.path] = { method: route.method, init: route.init, }
});

module.exports = () => {
    var router = express.Router();

    router.get("/", (req: any, res: any) => res.json({ status: 200, msg: "Welcome to the Firefly API!" }))

    router.use("/", (req: any, res: any, next: any) => {
        var route = routes[req.path];
        var method = req.method;

        if (route && route.method == method) {

            route.init(req, res)
        } else next();
    })

    router.use("/", (req: any, res: any) => {
        res.json({ status: 404, msg: "Not found!" });
    })

    return router;
}