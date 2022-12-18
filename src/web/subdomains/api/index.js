module.exports.handle = (req, res) => {
    var routes = fs.readdirSync(__dirname + "/routes");

    console.log(routes);

    res.send("WELCOME TO THE API");
}