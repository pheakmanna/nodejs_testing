"use strict";
let config = require('../bin/config');
let co = require("co");
let Auth_Function = require("../bin/auth_function");
let Admin = require("../bin/admin");



module.exports = function(req, res, next) {
    let token = "";
    token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
        co(Auth_Function.verifyToken(token))
            .then(function(val){
                if(val.success)
                    next();
                else
                    Admin.message_auth(req, res, {success: false, data: "Unauthorized"});
            });
    }else{
        Admin.message_auth(req, res, {success: false, data: "Unauthorized"});
    }
};