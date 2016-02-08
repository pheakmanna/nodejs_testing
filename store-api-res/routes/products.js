var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('.');
var multer  = require('multer')
var upload = multer({ dest: 'public/uploads' })
var fs = require('fs');
var middleware = require('../bin/middleware');
var formidable = require("formidable");

// route middleware to verify a token//
//router.use(middleware);

/* GET users listing. */
router
    .get('/', function(req, res, next) {
        var db = req.db;
        var products = db.get('tbl_product');
        products
            .find({}, {}, function(err, data){
                res.render('list_product', {username: req.username, products: data});
            });
        /*
        var io = req.io;
        io.on('connection',function(socket){
                console.log('a user connected ');
                socket.on('notification', function(msg){
                    //io.emit("notification", msg);
                    io.emit("notification","Product Modify");
                });
                //socket.broadcast.emit("notify everyone",{user : "test"});
            });*/
    });

/* POST new product */
router
    .post('/add', function(req, res){
        var db = req.db;
        var products = db.get('tbl_product');
     console.log(req);
    fs.readFile(req.files.fileUploaded.path, function (err, data) {
      
      var newPath = __dirname + "public/uploads/"+req.files.fileUploaded.fileName;
      fs.writeFile(newPath, data, function (err) {
        res.redirect("/");
      });
    });
    /*
    var form = new formidable.IncomingForm(),
        files = [],
        fields = [];

    console.log("About to parse");

    form.uploadDir = 'public/uploads/';
    form.on('end', function () {
        console.log('-> upload done');
        fs.rename(this.openedFiles[0].path,"");

        res.writeHead(200, {'content-type': 'text/html'});
        res.write('This file was uploaded <br/>' + '<img src="/show">');
        res.end();
    });
    form.parse(req);
    */
    
       /* products
            .insert({
                "product_name": req.body.productname,
                "price": req.body.price})
            .then(function(doc){ res.redirect("/products"); }) ;
        
        
           /* var tmp_path = req.files.thumbnail.path;
            var target_path = './public/images/' + req.files.thumbnail.name;
            fs.rename(tmp_path, target_path, function(err) {
                if (err) throw err;
                fs.unlink(tmp_path, function() {
                    if (err) throw err;
                    res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
                });
            });*/
    })
    .get('/add', function(req, res){
        req.io.emit('notification',"Create Product");
        res.render("create_product",{username: req.username});
    });

/* POST modify product */
router
    .get('/modify/:id', function(req, res){ 
        var db = req.db;
        var products = db.get('tbl_product');
        products
            .findById(req.params.id,function(err, data){
                res.render('modify_product',{username: req.username,id: req.params.id, product: data})
            });
    
    })
    .post('/modify/:id', function(req, res){
        var db = req.db;
        var products = db.get('tbl_product');
        products
            .findAndModify(
                {_id: req.objectId(req.params.id)},
                {$set: { "product_name": req.body.productname, "price": req.body.price}})
            .then(function(doc){ 
            
            res.redirect("/products"); })
    });

/* POST modify product */
router
    .get('/remove/:id', function(req, res){
        var db = req.db;
        var products = db.get('tbl_product');
        products
            .remove({_id: req.objectId(req.params.id)})
            .then(function(err){ res.redirect("/products"); });
});



module.exports = router;
