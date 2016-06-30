var express = require('express');
module.exports = function(app) {
    'use strict';
    var cgi_module = require('cgi');
    var cgi = express.Router();

    if ('development' == app.get('env')) {
        cgi.all('/tbk_bp_pago.cgi', function(req, res) {
            res.send('Probar en el servidor!');
        });
        cgi.all('/tbk_bp_resultado.cgi', function(req, res) {
            res.send('Probar en el servidor!');
        });
    } else {
        cgi.all('/tbk_bp_pago.cgi', cgi_module(app.path.join(__dirname, 'tbk_bp_pago.cgi')));
        cgi.all('/tbk_bp_resultado.cgi', cgi_module(app.path.join(__dirname, 'tbk_bp_resultado.cgi')));
    }

    return cgi;
};
