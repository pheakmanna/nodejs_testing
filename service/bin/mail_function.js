"use strict";
let config = require("../bin/config");
let mail = require("nodemailer");
let transporter = mail.createTransport(`smtps://${config.email}:${config.email_pass}@smtp.gmail.com/?pool=true`)
let Mail_funtion = {};

Mail_funtion.send = function *(to, subject, text, content){
    var mailOption = {
        from: `Dev Test <${config.email}>`,
        to: to,
        subject: subject,
        text: text,
        html: content
    };
    transporter.sendMail(mailOption);
};

module.exports = Mail_funtion;