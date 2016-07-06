module.exports = function(app, express) {


    app.sequelize = new app.Sequelize('node_webpay', "'node_webpay@whm.href.cl'@'localhost'", 'webpay#123456', {
        host: process.env.MYSQL_URL ? process.env.MYSQL_URL : '127.0.0.1',
        port: 3306,
        logging: console.log //false
    })

    function CGIFilter(fn) {
        return function(req, res, next) {
            if (req.path.match('cgi-bin') && req.method === 'POST') {
                return next();
            } else {
                return fn(req, res, next);
            }
        }
    }

    app.use(CGIFilter(app.bodyParser.urlencoded({ extended: true })));
    app.use(CGIFilter(app.bodyParser.json()));
    app.use(CGIFilter(app.cookieParser()));
    var session = require('express-session');
    app.use(app.session({
        cookie: { maxAge: 60000 },
        secret: 'gNpSiXpdNFfqweIdIvG_cChuQ_123',
        resave: true,
        saveUninitialized: true
    }));
    app.engine('html', require('ejs').renderFile);

    app.set('view engine', 'html');
    app.set('views', __dirname + '/www');

    app.use(app.methodOverride());
    app.use('/css', express.static(app.path.resolve('www', 'css')));
    app.use('/js', express.static(app.path.resolve('www', 'js')));
};
