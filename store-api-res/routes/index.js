"use strict";
let express = require('express');
let response = require('../bin/respone');
let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    let db = req.db;
    let products = db.get('tbl_product');
    products
        .find({}, {}, function (err, data) {
            res.render('index', {products: data});
        })

});

module.exports = router;
