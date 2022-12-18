module.exports = {
    path: "/git/push",
    method: "POST",
    init: (req, res) => {

        console.log(req.headers);

        res.json({code: 200, msg: "OK"});
    }
}