"use strict";

let express = require("express");
let userRoute = express.Router();
let middleware = require('./middleware');
let _function = require("../bin/user_functions");
let co = require('co');

/* Middleware */
userRoute.use(middleware);

/* Add New User */
userRoute.post("/add", function (req, res) {
    co(_function.insertUser(req, res));
});

/* Filter ALl User */
userRoute.get("/alluser", function (req, res) {
    co(_function.getAllUser(req, res));
});

module.exports = userRoute;
