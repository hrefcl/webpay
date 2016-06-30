var express = require('express');
module.exports = function(app) {
    'use strict';


    var webpay = express.Router();
    var Packs = app.schemas.packs;
    var Invoice = app.schemas.invoice;
    var Sales = app.schemas.sales;

    webpay.get('/pack/:id/', function(req, res) {
        console.log(req.params.id)
        Packs.find({ where: { id: req.params.id } }).then(function(pack) {
            var now = new Date();

            pack = JSON.parse(JSON.stringify(pack));
            if (pack.bonus_discount > 0) {
                pack.price = (pack.price - (pack.price * pack.bonus_discount) / 100)
            }
            pack.tipoTransaccion = "TR_NORMAL";
            pack.ORIGIN = "web";
            pack.generatedOC = "".concat(now.getFullYear(), (now.getMonth() + 1), (now.getDay() + 1), now.getHours(), now.getMinutes(), now.getSeconds());
            return res.render('comprar', {
                pack: pack,
            })
        }).catch(function(err) {
            console.log(err)
            return res.json({
                success: false,
                msg: err
            });
        });

    });


    webpay.all('/xt_compra', function(req, res) {
        console.log("Recibiendo confirmacion de Webpay");
        if (app.transbankIPS[req.ip] == undefined) {
            console.log("Intento de pago desde origen desconocido!!");
            return res.send("RECHAZADO");
        }

        function rejected(motivo, sale) {
            console.log(motivo);
            if (sale) {
                Sales.update({
                    ESTADO: 'rejected',
                    TBK_RESPUESTA: req.body.TBK_RESPUESTA,
                    TBK_CODIGO_AUTORIZACION: req.body.TBK_CODIGO_AUTORIZACION,
                    TBK_FINAL_NUMERO_TARJETA: req.body.TBK_FINAL_NUMERO_TARJETA,
                    TBK_FECHA_CONTABLE: req.body.TBK_FECHA_CONTABLE,
                    TBK_FECHA_TRANSACCION: req.body.TBK_FECHA_TRANSACCION,
                    TBK_HORA_TRANSACCION: req.body.TBK_HORA_TRANSACCION,
                    TBK_ID_TRANSACCION: req.body.TBK_ID_TRANSACCION,
                    TBK_TIPO_PAGO: req.body.TBK_TIPO_PAGO,
                    TBK_NUMERO_CUOTAS: req.body.TBK_NUMERO_CUOTAS,
                    TBK_VCI: req.body.TBK_VCI,
                    TBK_MAC: req.body.TBK_MAC,
                    COMENTARIO_TRANSACCION: motivo
                }, {
                    id: sale.id
                });
            }
            return res.send("RECHAZADO");
        };
        console.log("Ingreso XT_COMPRA");
        Sales.find({
            where: {
                TBK_ORDEN_COMPRA: req.body.TBK_ORDEN_COMPRA
            }
        }).then(function(sale) {
            if (!sale) return rejected("No se encuentra orden de compra en registros");
            if (sale.ESTADO === "confirmed") return rejected("Intento duplicidad de pago");

            checkMACPago(req.body, function(valido) {
                if (!valido) return rejected("Respuesta no ha pasado controles de seguridad", sale);

                if (req.body.TBK_RESPUESTA != 0) {
                    var mapaRechazo = {
                        "-1": "Rechazo de transaccion",
                        "-2": "Transaccion debe reintentarse.",
                        "-3": "Error en transaccion.",
                        "-4": "Rechazo de transaccion.",
                        "-5": "Rechazo por error de tasa.",
                        "-6": "Excede cupo maximo mensual.",
                        "-7": "Excede limite diario por transaccion.",
                        "-8": "Rubro no autorizado."
                    };
                    rejected(mapaRechazo[req.body.TBK_RESPUESTA], sale);
                }
                if (req.body.TBK_RESPUESTA == 0 && req.body.TBK_MONTO == sale.TBK_MONTO) {
                    sale.update({
                        ESTADO: 'confirmed',
                        TBK_RESPUESTA: req.body.TBK_RESPUESTA,
                        TBK_CODIGO_AUTORIZACION: req.body.TBK_CODIGO_AUTORIZACION,
                        TBK_FINAL_NUMERO_TARJETA: req.body.TBK_FINAL_NUMERO_TARJETA,
                        TBK_FECHA_CONTABLE: req.body.TBK_FECHA_CONTABLE,
                        TBK_FECHA_TRANSACCION: req.body.TBK_FECHA_TRANSACCION, //req.body.TBK_FECHA_TRANSACCION = (new Date()).toISOString();
                        TBK_HORA_TRANSACCION: req.body.TBK_HORA_TRANSACCION,
                        TBK_ID_TRANSACCION: req.body.TBK_ID_TRANSACCION,
                        TBK_TIPO_PAGO: req.body.TBK_TIPO_PAGO,
                        TBK_NUMERO_CUOTAS: req.body.TBK_NUMERO_CUOTAS,
                        TBK_VCI: req.body.TBK_VCI,
                        TBK_MAC: req.body.TBK_MAC,
                        fechaTransaccion: (new Date()).toISOString()
                    }).then(function(s_) {
                        return res.send('ACEPTADO');
                    });
                }
            });
        });
    });

    webpay.post('/createSale', function(req, res) {
        Packs.find({
            where: {
                sku: req.body.sku
            }
        }).then(function(pack) {
            console.log(pack)
            var hits = pack.hits;
            if (pack.bonus_hits > 0) {
                hits = (hits + pack.bonus_hits);
            }

            Invoice.create({
                price: pack.price,
                payment: 'webpay',
                status: 'pending',
                currency: pack.currency,
                hits: hits,
                id_user: req.user.id
            }).then(function(invoice) {
                var price = pack.price;
                if (pack.bonus_discount > 0) {
                    price = (price - (price * pack.bonus_discount) / 100)
                }
                Sales.create({
                    ORIGIN: req.body.ORIGIN,
                    TBK_ORDEN_COMPRA: req.body.generatedOC,
                    TBK_MONTO: price,
                    TBK_ID_SESION: req.user.token,
                    TBK_TIPO_TRANSACCION: req.body.tipoTransaccion,
                    ESTADO: "not_confirmed",
                    CURRENCY: pack.currency,
                    id_packs: pack.id,
                    id_invoice: invoice.id
                }).then(function(sale) {
                    return res.json({
                        success: true,
                        //sale: sale,
                    });
                }).catch(function(err) {
                    return res.json({
                        success: false,
                        msg: JSON.stringify(err)
                    });
                });
            }).catch(function(err) {
                return res.json({
                    success: false,
                    msg: JSON.stringify(err)
                });
            });
        }).catch(function(err) {
            return res.json({
                success: false,
                msg: JSON.stringify(err)
            });
        });
    });

    webpay.all('/error', function(req, res) {
        console.log("Ingreso ERROR");
        Sales.find({
            where: {
                TBK_ORDEN_COMPRA: req.body.TBK_ORDEN_COMPRA
            }
        }).then(function(sale) {
            if (!sale) return res.render('invoice', { pack: 'error' });;
            Invoice.find({
                where: {
                    id: sale.id_invoice
                }
            }).then(function(invoice) {
                if (!invoice) return res.render('invoice', { pack: sale });
                if (invoice) {
                    invoice.update({ status: 'rejected' }).then(function(i_) {
                        return res.render('invoice', { pack: i_ });
                    });
                }
            });
        });
    });

    webpay.all('/success', function(req, res) {
        console.log("Ingreso SUCCESS");
      
        if (!req.body.TBK_ORDEN_COMPRA) return res.redirect('/error');
        if (req.body.TBK_ORDEN_COMPRA) {

            Sales.find({
                where: {
                    TBK_ORDEN_COMPRA: req.body.TBK_ORDEN_COMPRA
                }
            }).then(function(sale) {
                if (!sale) return res.render('invoice', { pack: 'error' });
                Invoice.find({
                    where: {
                        id: sale.id_invoice
                    }
                }).then(function(invoice) {
                    if (!invoice) return res.render('invoice', { pack: sale });
                    if (invoice) {
                        invoice.update({ status: 'accepted' }).then(function(i_) {
                            return res.render('invoice', { pack: invoice });
                        });
                    }
                });
            });
        }
    });

    function checkMACPago(parameters, cb) {
        if ('development' == app.get('env')) {
            console.log('development')
            return cb(true);
        }

        var fs = require('fs');
        var file_name, cmdline;
        var child_process = require('child_process');

        var FullPath = __dirname + '/';

        file_name = FullPath + "mac/MAC01Normal" + parameters.TBK_ORDEN_COMPRA + ".txt";
        cmdline = app.path.resolve("cgi-bin", "tbk_check_mac.cgi");

        cmdline = cmdline + " " + file_name
        var paramsEncoded = "";
        for (var paramKey in parameters) {
            paramsEncoded += paramKey + '=' + parameters[paramKey] + '&';
        }
        fs.writeFile(file_name, paramsEncoded, function(err) {
            if (err) throw err;
            child_process.exec(cmdline, function puts(error, stdout, stderr) {
                var out = stdout;
                if (out.match('CORRECTO')) return cb(true);
                else return cb(false);
            });
        });
    }

    return webpay;
};
