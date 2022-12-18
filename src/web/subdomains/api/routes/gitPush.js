module.exports = {
    path: "/git/push",
    method: "GET",
    init: (req, res) => {
        res.send("GIT PUSH RECEIVED!");

        console.log(req.body);
    }
}