var fs = require('fs');
var http = require('http');
var https = require('https');

var express = require('express');
var app = express();

app.use(express.json());

var httpServer = http.createServer(app);

if (process.env.NODE_ENV != "development") {
    httpServer.listen(80);

    var privateKey = fs.readFileSync(process.env.WEB_SSL_PRIVKEY, 'utf8');
    var certificate = fs.readFileSync(process.env.WEB_SSL_CERT, 'utf8');

    var credentials = { key: privateKey, cert: certificate };

    var httpsServer = https.createServer(credentials, app);

    httpsServer.listen(443);
} else httpServer.listen(81);

var subdomains = {};
var subdomainFiles = fs.readdirSync(__dirname + "/subdomains");

subdomainFiles.forEach(subdomain => {
    subdomains[subdomain] = require(`${__dirname}/subdomains/${subdomain}/index.js`);
})

app.use((req, res, next) => {
    var subdomainText = req.subdomains[0] ?? "root";

    var subdomain = subdomains[subdomainText];

    console.log(subdomain);

    if (subdomain) {
        console.log("EXECUTE FUCKING SUBDOMAIN!");
        subdomain(req, res, next)
    } else res.send("404 not found!");
})