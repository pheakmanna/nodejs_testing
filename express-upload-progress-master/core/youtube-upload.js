"use strict";
let fs = require('fs');
let Youtube = require("youtube-api")
let ReadJson = require("r-json");
let Lien = require("lien");
let Logger = require("bug-killer");
let Opn = require("opn");
var ResumableUpload = require('node-youtube-resumable-upload');

// credentials from google api Auth ID
const CREDENTIALS = ReadJson("./core/code.json");

// Authenticate using the credentials
var oauth = Youtube.authenticate({
    type: "oauth"
    , client_id: CREDENTIALS.web.client_id
    , client_secret: CREDENTIALS.web.client_secret
    , redirect_url: CREDENTIALS.web.redirect_uris[0]
});

let upload = {};
upload.reqestYotubeCode = function *(){
    Opn(oauth.generateAuthUrl({
        access_type: "offline"
        , scope: ["https://www.googleapis.com/auth/youtube.upload"]
    }));
};

/************** Request & Store Token Function ***************/
upload.requestYoutubeToken = function *(code){
    oauth.getToken(code, function (err, tokens) {
        fs.writeFile("./core/token.json", JSON.stringify(tokens, null, 4));
    });
};

/************** Upload Video to youtube *********************/
upload.uploadVideo = function (res, file_path, metadata){
    var tokens = JSON.parse(fs.readFileSync('./core/token.json', 'utf8'));
    /*oauth.setCredentials(tokens);
    // And finally upload the video! Yay!
    Youtube.videos.insert({
        resource:metadata
        // This is for the callback function
        , part: "snippet,status"

        // Create the readable stream to upload the video
        , media: {
            body: fs.createReadStream(file_path)
        }
    }, function (err, data) {
        if (err) { console.log(err); }
        console.log(data);
        res.json(data);
    });
    */

    var resumableUpload = new ResumableUpload(); //create new ResumableUpload
    resumableUpload.tokens = tokens; //Google OAuth2 tokens
    resumableUpload.filepath = file_path;
    resumableUpload.metadata = metadata; //include the snippet and status for the video
    resumableUpload.retry = 3; // Maximum retries when upload failed.
    resumableUpload.upload();
    resumableUpload.on('progress', function(progress) {
        console.log(progress);
    });
    resumableUpload.on('success', function(success) {
        let data = JSON.parse(success);
        console.log(data.id);
        return data.id;


    });
    resumableUpload.on('error', function(error) {
        console.log(error);
        return "";
    });
};

module.exports = upload;