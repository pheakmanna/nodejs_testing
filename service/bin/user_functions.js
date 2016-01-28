"use strict";

let model = require("../models/model")();
let User = model.User;
var Validator = require('validatorjs');
var _ = require("underscore");
let User_Func = {};

//********** Check Validator Fields ***********/
User_Func.validateUser = function *(req) {

    //******************* Check Existing Email *********************/
    let user = yield User.find({where: {email: req.body.email}});
    Validator.register('verify_email', () => user ? false : true, "Email's Existing");

    let data = {
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        password: req.body.password
    };
    var rules = {
        firstName: 'required',
        lastName: 'required',
        email: 'required|verify_email|email',
        password:'required'
    };

    var validation = new Validator(data, rules);
    validation.passes();
    return validation.errors;
};

//********** Generator Function Insert User ***********/
User_Func.insertUser = function *(req, res) {
    let result = yield User_Func.validateUser(req);
    if (!_.isEmpty(result.errors))
        return {success: false, data: result.errors};
    else {
        let user = User.build({
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
            admin: req.body.admin
        });
        let result = yield user.save();
        return {success: true,
                data: {
                    id: result.id,
                    email: result.email
                }};
    }
};

//************ Generator Function get all user *********/
User_Func.getAllUser = function *(req, res) {
    let result = yield User.findAll({attributes: ["firstName", "lastName"]});
    res.json(result);
};

//************ Find User One ************/
User_Func.getOneUserByEmail = function *(email){
    console.log("d");
    let result = yield User.findOne({
        attributes: ["id" , "firstName", "lastName", "email", "password"],
        where: {email: email}});
    return result;
};

//************ Find User One ************/
User_Func.getOneUserById = function *(id){
    let result = yield User.findOne({
        attributes: ["id" , "firstName", "lastName", "email"],
        where: {id: id}});
    return result;
};

//************ Update User Password ******/
User_Func.updatePassword = function *(email, new_password){
    try {
        console.log(new_password);
        let result = yield User.update(
            {password: new_password},
            {where: {email: email}});
        return result[0];
    }catch (err){
        return err;
    }
};

module.exports = User_Func;