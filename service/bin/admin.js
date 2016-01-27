"use strict";
let co = require('co');
let admin = {};
admin.error_message = co.wrap(function *(req, res) {
        res.status(500);
        res.json({success: false});
    });

admin.sucess_message = co.wrap(function *(req, res) {
    res.status(200);
    res.json({success: true});
});

module.exports = admin;