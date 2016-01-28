"use strict"

let express = require("express");
let debug = require('debug')('service:server');
let bodyParser = require('body-parser');
let app = express();
let port = '5000';
let http = require('http');

/* Middleware */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(function(req, res, next){
    next();
});

/* Routes */
let userRoute = require("./routes/userroute");

let authRoute = require("./routes/authroute");

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

/* Create Server */
let server = http.createServer(app);
/* Run Server On Port */
server.listen(port, function(){
    console.log('%s listening at %s ', "localhost" , port);
});


