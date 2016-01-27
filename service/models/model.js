"use strict";

let db = require("../bin/database.js");
let DataType = db.Sequelize;
let sequelize = db.sequelize

let model = function() {
    /* User Model */
    let User = sequelize.define("users",{
        firstName: {
            type: DataType.STRING,
            field: 'firstname'
        },
        lastName: {
            type: DataType.STRING,
            field: 'lastname'
        },
        email: {
            type: DataType.STRING,
            field: 'email'
        },
        password: {
            type: DataType.STRING,
            field: 'password'
        },
        token: {
            type: DataType.STRING,
            field: 'remember_token'
        },
        admin: {
            type: DataType.BOOLEAN
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });
    //User.sync();

    let Auth = sequelize.define("auth", {
        user_id: {
            type: DataType.INTEGER,
            field: 'user_id'
        },
        token: {
            type: DataType.STRING,
            field: 'token'
        },
        expire: {
            type: DataType.BOOLEAN
        },
        expire_date: {
            type: DataType.DATE,
            field: 'expire_date'
        }
    },{
        freezeTableName: true
    });
    //Auth.sync();


    return{
        User: User,
        Auth: Auth,
        sequelize: sequelize
    }
};
module.exports = model;
