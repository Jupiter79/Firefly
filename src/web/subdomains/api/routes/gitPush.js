const { exec } = require('child_process');
const crypto = require('crypto');

var validate_secret = (signature, payload) => {
    var hmac = crypto.createHmac('sha1', process.env.GITHUB_WEBHOOK_SECRET);
    hmac.update(JSON.stringify(payload));
    var calculatedSignature = 'sha1=' + hmac.digest('hex');

    return signature == calculatedSignature;
}

module.exports = {
    path: "/git/push",
    method: "POST",
    init: (req, res) => {
        if (validate_secret(req.headers["x-hub-signature"], req.body) && req.body.ref == "refs/heads/main") {
            res.json({ code: 200, msg: "OK" });

            exec("git pull && npm install && npx prisma migrate dev && pm2 restart Firefly");
        } else res.json({code: 400, msg: "Not authorized"});
    }
}