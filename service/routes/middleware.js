"use strict";
let jwt = require('jsonwebtoken');
let config = require('../bin/config');
let model = require("../models/model");
let Auth = model.Auth;



module.exports = function(req, res, next) {
    let token = "";
    token = req.body.token || req.query.token || req.headers['token'];
    console.log(token);
    if(token){
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                res.status(403);
                res.send({success: false, message: 'Token Expired.'});
            } else {
                Auth
                    .findOne({
                        attributes: ["user_id"],
                        where: {token: token}})
                    .then(function (data) {
                        if(!data){
                            res.status(401);
                            res.json({success: false, message:'Authentication Fail'});
                        }
                        else{
                            next();
                        }
                    });
            }
        });
    }else{
        res.status(401);
        res.json({success: false, message:'Authentication Fail'});
    }
};