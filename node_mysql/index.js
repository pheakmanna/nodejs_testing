"use strict";

let express = require('express');
let bodyParser = require('body-parser');
let ejs = require('ejs');
let fs = require("fs");
let app = express();
let port=5000;

app.set('views', './views');
app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');

app.use(bodyParser.json());     
app.use(bodyParser.urlencoded({extended: false}));
 
app.post('/data', function(req, res) {
  console.log(req.body);
});

app.get('/', function(req, res){
    var post_data = req.body;
    console.log(post_data);
    res.send(post_data);
});

app.get('/hello', function(req, res){
    res.render('hello.html');
});

app.get('/display', function(req, res){
    let data = require('./data.json');
    fs.readFile( "./data.json", 'utf8', function (err, data) {
        console.log( data );
        res.render('display',{ data : data });
   });
   // res.render('display',{ data : 'data' });
});

/*** Book Router ***/
let userRouter = require("./routes/userRouter");
app.use("/api",userRouter)

/*** Product Router ***/
let productRouter = require("./routes/productRouter");

app.use("/api",productRouter);

app.listen(port,function(){
    console.log("server on port 5000");
    
});