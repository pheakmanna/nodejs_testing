"use strict";

let express = require('express');
let userController = require('../controllers/userController')();
let userRouter = express.Router();
/*
bookRouter.route('/Books/create')
    .get(bookController.createUser);*/

userRouter.route('/User')
    .get(userController.findUserOne);  

userRouter.route('/User/search')
    .get(userController.findUserByName);  

userRouter.route('/User/searchall')
    .get(userController.getAllUserName);

userRouter.route('/User/auth')
    .get(userController.getAllAuth);

userRouter.route('/User/query')
    .get(userController.QueryAllUser);

userRouter.route('/User/insertgame')
    .get(userController.InsertGame);

module.exports = userRouter;