module.exports = {
    path: "/git/push",
    method: "GET",
    init: (req, res) => {

        console.log(req.method);
        res.send("GIT PUSH RECEIVED!");

        console.log(req.body);
    }
}