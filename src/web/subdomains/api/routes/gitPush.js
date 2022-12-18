module.exports = {
    path: "/git/push",
    method: "POST",
    init: (req, res) => {
        res.send("GIT PUSH RECEIVED!");

        console.log(req.body);
        console.log("")
    }
}