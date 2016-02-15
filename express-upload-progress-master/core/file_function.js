"use strict";
let express = require('express');
let http = require('http');
let path = require('path');
let mime = require('mime');
let co = require('co');
let fs = require('fs');
let file_function = {};

file_function.stream_response = function *(req, res){
    let file = path.resolve('./tmp/',req.params.file);
    let range = req.headers.range;
    let positions = range.replace(/bytes=/, "").split("-");
    let start = parseInt(positions[0], 10);

    fs.stat(file, function(err, stats) {
        if(err){
            console.log(err);
        }else {
            let total = stats.size;
            let end = positions[1] ? parseInt(positions[1], 10) : total - 1;
            let chunksize = (end - start) + 1;

            res.writeHead(206, {
                "Content-Range": "bytes " + start + "-" + end + "/" + total,
                "Accept-Ranges": "bytes",
                "Content-Length": chunksize,
                "Content-Type": "video/mp4"
            });

            let stream = fs.createReadStream(file, {start: start, end: end})
                .on("open", function () {
                    stream.pipe(res);
                    console.log("streaming " + start);
                }).on("error", function (err) {
                    res.end(err);
                });
        }
    });
};

file_function.message = function *(){
    console.log("hello");
};



file_function.error = function *() {
    yield file_function.message();
};
module.exports = file_function;