var fs = require('fs');
var http = require('http');
var https = require('https');

var express = require('express');
var app = express();

var httpServer = http.createServer(app);

if (process.env.NODE_ENV != "development") {
    httpServer.listen(80);

    var privateKey = fs.readFileSync(process.env.WEB_SSL_PRIVKEY, 'utf8');
    var certificate = fs.readFileSync(process.env.WEB_SSL_CERT, 'utf8');

    var credentials = { key: privateKey, cert: certificate };

    var httpsServer = https.createServer(credentials, app);

    httpsServer.listen(443);
} else httpServer.listen(81);

var subdomains = [];
var subdomainFiles = fs.readdirSync(__dirname + "/subdomains");

subdomainFiles.forEach(subdomain => {
    subdomains.push({ [subdomain]: require(`${__dirname}/subdomains/${subdomain}/index.js`) });
})

console.log(subdomains);

app.use("/", (...args) => {
    var subdomain = req.subdomains[0] ?? "root";

    subdomain = subdomains[subdomain];

    if (subdomain) {
        subdomain.handle(...args);
    } else res.send("404 not found!");
})