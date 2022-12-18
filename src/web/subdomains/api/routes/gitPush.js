module.exports = {
    path: "/git/push",
    init: (req, res) => {
        res.send("GIT PUSH RECEIVED!");

        console.log(req.body);
        console.log("")
    }
}