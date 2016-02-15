"use strict";
let express = require('express');
let http = require('http');
let path = require('path');
let mime = require('mime');
let co = require('co');
let fs = require('fs');
let file_function = require('./core/file_function');
let app = express();
let Youtube = require("youtube-video-api");

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({
    keepExtensions: true,
    uploadDir: __dirname + '/tmp',
    limit: '1000mb',
    defer: true

}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/public', express.static(path.join(__dirname,'public')));
app.use('/tmp', express.static(path.join(__dirname,'tmp')));

app.get('/stream/:file', function(req, res){
    co(function *(){
        yield file_function.stream_response(req, res);
        yield file_function.error();
    })
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/download/:file', function(req, res){
  let file = __dirname + '/tmp/'+ req.params.file;
  let filename = path.basename(file);
  let mimetype = mime.lookup(file);
  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);
  let filestream = fs.createReadStream(file);
  filestream.pipe(res);
});

app.post('/', function(req, res) {
    req.form.on('progress', function(bytesReceived, bytesExpected) {
        //console.log(((bytesReceived / bytesExpected)*100) + "% uploaded");
    });
    req.form.on('end', function() {
        let file = req.files.myFile;
        fs.rename(file.path, __dirname + '/tmp/' +file.name, function(err) {
            if ( err ) 
                console.log('ERROR: ' + err);
            else
                console.log("Rename completed");
        });
        console.log(file.name);
        //res.send("well done");
    });
  //deleteAfterUpload(req.files.myFile.path);
    res.end();
});

app.post('/upload', function(req, res){
    co(upload.reqestYotubeCode());
    console.log("Update");
    req.form.on('progress', function(bytesReceived, bytesExpected) {
       // console.log(((bytesReceived / bytesExpected)*100) + "% uploaded");
        console.log(bytesExpected + "% uploaded");
    });
    req.form.on('end', function() {
        let file = req.files.myFile;
        fs.rename(file.path, __dirname + '/tmp/' +file.name, function(err) {
            if ( err )
                console.log('ERROR: ' + err);
            else
                console.log("Rename completed");
        });

        var metadata={
            snippet: {
                title: file.name,
                description: 'This is a test video uploaded from the YouTube API'
            },
            status: {
                privacyStatus: 'public'
            }
        };
        upload.uploadVideo(res,__dirname + '/tmp/' +file.name, metadata);
    });

    res.end();
});

app.get('/translate', function(req, res) {
    var translate = require("node-google-translate");

    translate({
        q: 'text',
        source: 'es',
        target: 'en'
    }, function(result) {
        console.log(result);
    });
    res.end();
    /*var googleTranslate = require('google-translate')("AIzaSyATkFAFSDdIupOkUvmltPB6EpJsaScw1tI");
    googleTranslate.translate(['Hello', 'Thank you'], 'en', 'de', function(err, translations) {
        if(err) res.json(err);
        console.log(translations);
        res.json(translations)
        // =>  [{ translatedText: 'Hallo', originalText: 'Hello' }, ...]
    });*/
});

/************** Youtube Upload ****************/

// Open the authentication url in the default browser
let upload = require("./core/youtube-upload");
app.get('/upload-test', function(req, res){
    co(upload.reqestYotubeCode(req.query.code));
    res.send("Completed");
});

// Callback url to get token code from request /upload-test
app.get('/oauth2callback', function(req, res) {
    co(upload.requestYoutubeToken(req.query.code));
    res.end();
});

/**************** Upload video to youtube by token **************************/
 app.get("/youtube-upload", function(req, res){
    /*
     req.form.on('progress', function(bytesReceived, bytesExpected) {
         //console.log(((bytesReceived / bytesExpected)*100) + "% uploaded");
     });
     req.form.on('end', function() {
         let file = req.files.myvideo;
         fs.rename(file.path, __dirname + '/tmp/' +file.name, function(err) {
             if ( err )
                 console.log('ERROR: ' + err);
             else
                 console.log("Rename completed");
         });
         var metadata={
             snippet: {
                 title: 'test video',
                 description: 'This is a test video uploaded from the YouTube API'
             },
             status: {
                 privacyStatus: 'public'
             }
         };
         upload.uploadVideo(res,__dirname + '/tmp/' +file.name, metadata);
         //deleteAfterUpload(__dirname + '/tmp/' +file.name);
     });*/
     var metadata={
         snippet: {
             title: 'test video',
             description: 'This is a test video uploaded from the YouTube API'
         },
         status: {
             privacyStatus: 'public'
         }
     };
     upload.uploadVideo(res,__dirname + '/tmp/overpass-clip_1.mp4', metadata);
     res.end();
     //res.end();

 });
let ffmpeg = require('ffmpeg');

/**************** water mate *******************/
 app.get("/con", function(req, res){
     try {
         console.log("d");
         var process = new ffmpeg(__dirname + '/tmp/test.mp4');
         process.then(function (video) {
             // Callback mode

             video.fnAddWatermark(__dirname + '/tmp/index.png', __dirname + '/tmp/your_file_video.mp4', {
                 position : 'SE'
                 , margin_nord     : null      // Margin nord
                 , margin_sud      : null      // Margin sud
                 , margin_east     : null      // Margin east
                 , margin_west     : null      // Margin west
             }, function (error, file) {
                 if (!error)
                     console.log('New video file: ' + file);
                 else
                    console.log(error);
             });


         }, function (err) {
             console.log('Error: ' + err);
         });
     } catch (e) {
         console.log(e.code);
         console.log(e.msg);
     }
    res.end();
/*
     try {
         var process = new ffmpeg( __dirname + '/tmp/test.mp4');
         process.then(function (video) {
             console.log('The video is ready to be processed');
             var watermarkPath = __dirname + '/tmp/index.png',
                 newFilepath = __dirname + '/tmp/video-com-watermark.mp4',
                 settings = {
                     position        : "SE"      // Position: NE NC NW SE SC SW C CE CW

                 };
             var callback = function (error, files) {
                 if(error){
                     console.log('ERROR: ', error);
                 }
                 else{
                     console.log('TERMINOU', files);
                 }
             }
             //add watermark
             video.fnAddWatermark(watermarkPath, newFilepath, settings, callback)

         }, function (err) {
             console.log('Error: ' + err);
         });
     } catch (e) {
         console.log(e.code);
         console.log(e.msg);
     }
     res.end();*/
 });

 let deleteAfterUpload = function(path) {
     setTimeout( function(){
     fs.unlink(path, function(err) {
     if (err) console.log(err);
     console.log('file successfully deleted');
     });
     }, 60 * 1000);
 };

// Start the app
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});