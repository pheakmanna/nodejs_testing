"use strict";

let model = require("../models/model.js")();
let validator = require("validator");

let productController = function(){
    
    let Game = model.Game;
    /****************************** 
        Insert Game 
    *******************************/
    let InsertGame = function(req, res){

        if(validator.isNull(req.body.game_name) || validator.isNull(req.body.price) || validator.isNull(req.body.rating)){
            res.status(403);
            res.send("Bad parameter");
        }else{
            let new_game = Game.build({
                gamename: req.body.game_name,
                price: req.body.price,
                rating: req.body.rating
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
    /****************************** 
        Update Game By Id 
    *******************************/
    let UpdateGame = function(req, res){
        console.log(req.body.id);
        
        Game.update({
            gamename: req.body.game_name
        },{
            where: {
                id: validator.toInt(req.body.id)
            }
        }).then(function(data){
                res.status(200);
                res.send(data);
            }).catch(function(error){
                res.status(500);
                res.send(error);
            });
    };
     /****************************** 
        delete Game by Id
    *******************************/
    let DeleteGame = function(req, res){
        Game.destroy({
            where:{
                id: validator.toInt(req.body.id) 
            }
        }).then(function(data){
                res.status(200);
                res.send(data);
            }).catch(function(error){
                res.status(500);
                res.send(error);
            });
    };
    
    /****************************** 
        Get Game By Query 
    *******************************/
    let Search = function(req, res){
        Game.findAll({
            where: req.query   
        }).then(function(game){
            res.status(200);
            res.send(game);
        });
    };
    /****************************** 
        Get Game By Limit 
    *******************************/
    let GetGames = function(req, res){
        Game.findAll({
            limit: validator.toInt(req.query.limit)
        }).then(function(game){
            res.status(200);
            res.send(game);
        });
    };
    
    /****************************** 
        Get Game By Id 
    *******************************/
    let GetGameById = function(req, res){
        Game.findOne({
            where: {
                id: req.params.id
            }
        }).then(function(game){
            res.status(200);
            res.send(game);
        });
    };
    
    return {
        InsertGame: InsertGame,
        Search: Search,
        GetGames: GetGames,
        GetGameById: GetGameById,
        UpdateGame: UpdateGame,
        DeleteGame: DeleteGame
    }
};

module.exports = productController;