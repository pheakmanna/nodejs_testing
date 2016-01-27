"use strict";

var Sequelize = require('sequelize');
var sequelize = new Sequelize('mysql://root@localhost/chezmoi');
let db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.sequelize
    .authenticate()
    .then(function(err) {
        console.log('Database Connection successfully.');
    }, function (err) {
        console.log('Unable to connect to the database:', err);
    });

module.exports = db;