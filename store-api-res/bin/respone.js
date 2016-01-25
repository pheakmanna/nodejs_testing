"use strict";

module.exports = {
        ok: function (req, res, content, message) {
            res.status(200);
            res.send({success: true,data: {content: content, message: message}})
        },
        error: function (req, res, error) {
            res.status(500);
            res.send({success: false,error: error});
        },
        error_msg: function (req, res, message) {
            res.status(500);
            res.send({success: false,error: {message: message}});
        }
};
