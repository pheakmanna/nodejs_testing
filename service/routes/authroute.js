"use strict";

let express = require("express");
var moment = require('moment');
let authRoute = express.Router();
let config = require('../bin/config');
let _function = require('../bin/auth_function');
let co = require("co");

/* Login */
authRoute.post("/login", function (req, res) {
    co(_function.VerifyLogin(req.body.email, req.body.password))
        .then(function(val){
            res.json(val);
        });
});

/* Verify Token */
authRoute.post("/verify", function (req, res) {
    let token = "";
    token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
        co(_function.verifyToken(token))
            .then(function(val){
                res.json(val);
            });
    }

});

module.exports = authRoute;
