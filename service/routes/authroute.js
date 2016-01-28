"use strict";

let express = require("express");
var moment = require('moment');
let authRoute = express.Router();
let config = require('../bin/config');
let _function = require('../bin/auth_function');
let middleware = require('./middleware');
let Admin = require('../bin/admin');
let co = require("co");

//********** Register User ************/
authRoute.post("/register", function (req, res){
    co(_function.register(req, res))
        .then(function (val) {
            Admin.message(req, res, val);
        });
});

/* Login */
authRoute.post("/login", function (req, res) {
    co(_function.VerifyLogin(req.body.email, req.body.password))
        .then(function(val){
            Admin.message(req, res, val);
        });
});

/* Verify Token */
authRoute.post("/verify", function (req, res) {
    let token = "";
    token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
        co(_function.verifyToken(token))
            .then(function(val){
                Admin.message(req, res, val);
            });
    }
});

//*********** Reset Password **************/
authRoute.post("/reset", middleware ,function (req, res){
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    let password = req.body.password || req.query.password || req.headers['password'];
    let new_password = req.body.new_password || req.query.new_password || req.headers['new_password'];
    if(token) {
        co(_function.resetPassword(token, password, new_password))
            .then(function (val) {
                Admin.message(req, res, val);
            });
    }else{
        Admin.message(req, res, {success: false, data: "Invalid Token"});
    }
});



module.exports = authRoute;
