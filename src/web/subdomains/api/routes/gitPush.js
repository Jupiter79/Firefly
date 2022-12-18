const crypto = require('crypto');

var validate_secret = (signature, payload) => {
    var hmac = crypto.createHmac('sha1', config.github.secret);
    hmac.update(JSON.stringify(payload));
    var calculatedSignature = 'sha1=' + hmac.digest('hex');

    return signature == calculatedSignature;
}

module.exports = {
    path: "/git/push",
    method: "POST",
    init: (req, res) => {
        if (validate_secret(req.headers["x-hub-signature"], req.body)) {
            res.json({ code: 200, msg: "OK" });

            process.exit(1);
        } else res.json({code: 400, msg: "Not authorized"});
    }
}