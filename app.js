var express = require('express');

var http = require("http");
var https = require("https");
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session');

app.crypto = require('crypto');

app.methodOverride = require('method-override')

app.ejs = require('ejs');
app.session = session;
app.cookieParser = require('cookie-parser');
app.http = http;
app.bodyParser = bodyParser;
app.https = https;
app.path = require('path');
app.cors = require('cors');
app.fs = require('fs');
app.vhost = require('vhost');
app.static = require('node-static');
app.Sequelize = require("sequelize");

require('./config')(app, express);

var error, schemas;
try {
    require('./schema')(app);
} catch (e) {
    error = e;
    console.log(error);
}

var cgi = require('./cgi-bin/index')(app, express);
app.use('/cgi-bin', cgi);

var apiRoute = require('./webpay/api')(app, express);
app.use('/webpay', apiRoute);

app.all('/', function(req, res) {
    app.schemas.packs.findAll().then(function(packs) {
        return res.render('index', {
            packs: packs,
        })
    }).catch(function(err) {
        return res.json({
            success: false,
            msg: err
        });
    });
});

app.transbankIPS = {
    "54.207.47.15": "Certificacion",
    "200.10.12.55": "Certificacion",
    "200.10.14.162": "Produccion",
    "200.10.14.163": "Produccion",
    "200.10.12.162": "Produccion",
    "200.10.12.163": "Produccion",
    "200.10.14.34 ": "Produccion",
    "200.10.14.177": "Produccion",
    "104.245.37.117": "Data Base",
    "104.245.37.192": "Haawi Server",
    "54.207.47.15": "Transbank",
    "54.207.47.15:5555": "Transbank",
    "200.10.14.34": "Transbank"
};


app.server = http.createServer(app);

if (!process.env.PORT) {
    process.env.PORT = 6969;
}

app.port = process.env.PORT;
app.server.listen(process.env.PORT)
