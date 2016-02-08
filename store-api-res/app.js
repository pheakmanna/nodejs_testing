"use strict";
let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
let flash = require('express-flash');
let config = require('./bin/config');
let db = require('./bin/database');
let response = require('./bin/respone');
let mongodb = require('mongodb');
let debug = require('debug')('store-api:server');
let http = require('http');
let multer = require('multer');
let app = express();
let sessionStore = new session.MemoryStore;

let port = '3000';
app.set('port', port);
let server = http.createServer(app);

/* Load Notification */
let notification = require('./bin/notification') (server);

// Config Database Middleware
app.use(function(req, res, next){
    req.db = db;
    req.objectId = mongodb.ObjectID;
    req.io = notification.io;
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('superSecret', config.secret);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/***** flash session *****/
app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(flash());
/***** Route *****/
let routes = require('./routes/index');
let auth = require('./routes/auth');
let products = require('./routes/products');
app.use('/', routes);
app.use('/auth', auth);
app.use('/products', products);

/*app.use('/', function(req, res){
    response.ok(req, res,"test","hello");
});*/

// no stacktraces leaked to user
/*app.use(function(err, req, res, next) {
    response.error(req, res, err);
});*/

server.listen(port, function (err) {
    if (err) {
        console.log(err);
        response.error(req, res, err);
    } else console.log('server run on port: ' + port);
});
//module.exports = app;
