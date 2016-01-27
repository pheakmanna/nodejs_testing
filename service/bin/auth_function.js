"use strict";

let model = require("../models/model")();
let User_Function = require("../bin/user_functions");
var Validator = require('validatorjs');
let _ = require("underscore");
let moment = require('moment');
let jwt = require('jsonwebtoken');
let config = require('../bin/config');
let Auth = model.Auth;
let Auth_Function = {};

//*************** validate login information ***************/
Auth_Function.loginValidate = function *(email, password) {
    let data = {
        email: email,
        password: password
    };
    var rules = {
        email: 'required|email',
        password: 'required'
    };
    var validation = new Validator(data, rules);
    validation.passes();
    return validation.errors;
};

//*************** Verify Login and return token ***************/
Auth_Function.VerifyLogin = function *(email, password){
    let result = yield Auth_Function.loginValidate(email, password);
    if(!_.isEmpty(result.errors))
        return result.errors;
    else {
        let check = yield Auth_Function.checkUserPassword(email, password);
        if(check.login){
            let now = moment();
            let token = yield Auth_Function.generateToken(now);
            let user = check.user;
            let data_user = {
                id: user.id,
                firstname: user.firstName,
                lastname: user.lastname,
                email: user.email,
                toke: token
            };
            yield Auth_Function.destroyAuth(user.id);
            yield Auth_Function.createAuth(user, token);
            return {login: true, user: data_user};
        }else{
            return check;
        }
    }
};

//************* Check User Password *******************/
Auth_Function.checkUserPassword = function *(email, password) {
    let users = yield User_Function.getOneUserByEmail(email);
    if (_.isEmpty(users)) {
        return {login: false, message: "Wrong User"};
    } else {
        let user = users.dataValues;
        if (user.password != password) {
            return {login: false, message: "Wrong Password"};
        }
        return {login: true, user: user};
    }
};

//*************** Generate Token ***********************/
Auth_Function.generateToken = function *(data) {
    let token = jwt.sign(data, config.secret,{expiresInMinutes: config.expireminute});
    return token;
};

//************ Destroy Auth ****************/
Auth_Function.destroyAuth = function *(user_id) {
    yield Auth.destroy({where: {user_id: user_id}});
};

//*********** Create Auth ******************/
Auth_Function.createAuth = function *(user, token) {
    yield Auth.create({
        user_id: user.id,
        token: token,
        expire: false,
        expire_date: moment().add(config.expireminute, 'minutes')});
};

//*************** verify token ***************/
Auth_Function.verifyToken = function *(token){
    let check = yield Auth_Function.checkExpireToken(token);
    if(!check){
        return {verfiy: false, message: 'invalide token'};
    }else{
        let users = yield Auth_Function.getAuthbyToken(token);
        let user = yield User_Function.getOneUserById(users.user_id);
        return user;
    }
};

//************** check token expire **********/
Auth_Function.checkExpireToken = function *(token) {
    try {
        let result = jwt.verify(token, config.secret);
    }catch (err){
        return false;
    }
    return true;
};

//************** find Auth by Token **********/
Auth_Function.getAuthbyToken = function *(token){
    let result = yield  Auth.findOne({attributes: ["user_id"], where: {token: token}});
    return result;
}

Auth_Function.resetPassword = function *(user, password) {
    
};

module.exports = Auth_Function;
