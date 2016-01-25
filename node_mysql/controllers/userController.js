"use strict";
let model = require("../models/model.js")();
let validator = require("validator")

let userController = function(){
    
    let User = model.User;
    let Auth = model.Auth;
    let Game = model.Game;
    
    let findUserOne = function(req, res){
        User.findAll().then(function (user) {
            res.json(user);
            console.log(user);
        });
    };
    
    let findUserByName = function(req, res){
        console.log(req.query.name);
        User.findAll({
            where: {
                first_name: req.query.name
            }
        }).then(function (user) {
            res.json(user);
            console.log(user);
        });
    };
    
    let getAllUserName = function(req, res){
        User.findAll({
            attributes: ['first_name']
        }).then(function (user) {
            res.json(user);
            console.log(user);
        });
    };
    
    let QueryAllUser = function(req, res){
        model.sequelize.query('SELECT distinct * FROM user',{ type: model.sequelize.QueryTypes.SELECT }
        ).then(function(user) {
            res.send(user);
        })
    };
    
    let getAllAuth = function(req, res){
        /*User.findAll({
            include: [{
                model: Auth,
                where: { status: Sequelize.col('User.lastname')}
            }]
        }).then(function(user){
            res.json(user);
            console.log(user);
        });*/
        Auth.findAll().then(function (user) {
            res.json(user);
            console.log(user);
        });
    };
    
    let InsertGame = function(req, res){
        if(validator.isNull(req.query.rating)){
            res.status(403);
            res.send("rating not null");
        }else{
            let new_game = Game.build({
                gamename: req.query.game_name,
                price: req.query.price,
                rating: req.query.rating
            });

            new_game.save().then(function(data){
                res.status(200);
                res.send(data);
            }).catch(function(error){
                res.status(500);
                res.send(error);
            })
        }
    };
    
    return {
      /*  createUser: createUser,*/
        getAllUserName: getAllUserName,
        findUserOne: findUserOne,
        findUserByName: findUserByName,
        getAllAuth: getAllAuth,
        QueryAllUser: QueryAllUser,
        InsertGame: InsertGame
    }
}

module.exports = userController;