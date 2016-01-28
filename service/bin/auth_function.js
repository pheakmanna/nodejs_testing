"use strict";

let model = require("../models/model")();
let User_Function = require("../bin/user_functions");
var Validator = require('validatorjs');
let _ = require("underscore");
let moment = require('moment');
let jwt = require('jsonwebtoken');
let config = require('../bin/config');
let Mail_function = require("../bin/mail_function");
let Auth = model.Auth;
let Auth_Function = {};


//*************** Register *********************************/
Auth_Function.register = function *(req, res) {
    let result = yield User_Function.insertUser(req, res);
    if(result.success){
        let content = `<p>Email: ${req.body.email}</p>`+
                "<a href='http://localhost:5000/'>Conform Mail</a>"+
                "<p>Thank you for register</p>" ;
        yield Mail_function.send(req.body.email, "New Register", "test", content)
    }
    return result;
};

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
        if(check.success){
            let now = moment();
            let token = yield Auth_Function.generateToken(now);
            let user = check.data;
            let data_user = {
                id: user.id,
                firstname: user.firstName,
                lastname: user.lastname,
                email: user.email,
                toke: token
            };
            yield Auth_Function.destroyAuth(user.id);
            yield Auth_Function.createAuth(user, token);
            return {success: true, data: data_user};
        }else{
            return check;
        }
    }
};

//************* Check User Password *******************/
Auth_Function.checkUserPassword = function *(email, password) {
    let users = yield User_Function.getOneUserByEmail(email);
    if (_.isEmpty(users)) {
        return {success: false, data: "Wrong User"};
    } else {
        let user = users.dataValues;
        if (user.password != password) {
            return {success: false, data: "Wrong Password"};
        }
        return {success: true, data: user};
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
        return {success: false, data: 'Invalid Token'};
    }else{
        let users = yield Auth_Function.getAuthbyToken(token);
        let user = yield User_Function.getOneUserById(users.user_id);
        return {success: true, data: user.dataValues};
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

Auth_Function.resetPassword = function *(token, password, new_password) {
    let check = yield Auth_Function.verifyToken(token);

    if(check.success){

        let email = check.data.email;
        let check_user = yield Auth_Function.checkUserPassword(email, password);
        if(check_user.success) {
            console.log(email);
            let update = yield User_Function.updatePassword(email, new_password);
            if(update==1)
                return({success: true, data: 'Reset Completed'});
            else
                return({success: false, data: 'Reset Error'});
        }else{
            return {success: false, data: 'Wrong Old Password'};
        }
    }
    else{
        return {success: false, data: 'Invalid Token'};
    }
};

module.exports = Auth_Function;
