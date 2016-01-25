"use strict";
var Sequelize = require('sequelize');
var sequelize = new Sequelize('mysql://localhost/test');
let db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.sequelize
    .authenticate()
      .then(function(err) {
        console.log('Connection has been established successfully.');
      }, function (err) {
        console.log('Unable to connect to the database:', err);
      });
    
module.exports = db;