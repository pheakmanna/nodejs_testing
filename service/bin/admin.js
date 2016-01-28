"use strict";
let admin = {};
admin.message = function (req, res, data) {
    res.removeHeader('X-Powered-by');
    res.removeHeader('Date');
    res.removeHeader('Connection');
    res.removeHeader('ETag');
    if(!data.success){
        res.status(500);
        res.json({success: false, message: data.data});
    }else{
        res.status(200);
        res.json({success: true ,message: data.data});
    }
};

admin.message_auth = function (req, res, data) {
    res.removeHeader('X-Powered-by');
    res.removeHeader('Date');
    res.removeHeader('Connection');
    res.removeHeader('ETag');
    if(!data.success){
        res.status(401);
        res.json({success: false, message: data.data});
    }else{
        res.status(200);
        res.json({success: true ,message: data.data});
    }
};

module.exports = admin;