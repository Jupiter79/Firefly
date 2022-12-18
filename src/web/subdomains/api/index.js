module.exports.handle = (req, res) => {
    var routes = fs.readdirSync(__dirname + "/routes");

    console.log(routes);
}