"use strict";
let db = require("../models/db_config.js");
let DataType = db.Sequelize;
let sequelize = db.sequelize

let model = function() {
    /* User Model */
    let User = sequelize.define("user",{
        firstName: {
            type: DataType.STRING,
            field: 'first_name' 
        },
        lastName: {
            type: DataType.STRING
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });
    
    let Auth = sequelize.define("auth",{
        firstName: {
            type: DataType.STRING,
            field: 'first_name' 
        },
        lastName: {
            type: DataType.STRING
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });
    //Auth.sync();
    
    let Game = sequelize.define("game",{
        gamename: {
            type: DataType.STRING,
            field: "game_name"
        },
        price: {
            type: DataType.FLOAT                       
        },
        rating: {
            type: DataType.INTEGER                     
        }
    });
    
    return{
        User: User,
        Auth: Auth,
        Game: Game,
        sequelize: sequelize
    }
};
module.exports = model;
