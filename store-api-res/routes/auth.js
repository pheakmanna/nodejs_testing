var express = require('express');
var jwt = require('jsonwebtoken');
var authRouter = express.Router();
var config = require('../bin/config');

authRouter.route('/')
    .get(function(req, res) {
        res.redirect('/');
    });

authRouter
    .route('/register')
    .post(function(req, res){
        var db = req.db;
        var users = db.get('tbl_user');
        users
            .insert({
                username: req.body.username,
                password: req.body.password})
            .then(function(user){    
                var token = jwt.sign(user, config.secret,{
                                    expiresInMinutes: 10
                                });
            
                                /* store token in databae */
                                var auth = db.get("tbl_auth");
                                auth
                                    .remove({user_id: user._id})
                                    .then(function(err){
                                        auth.insert({
                                            user_id: user._id,
                                            token: token,
                                            expire: false })
                                        .then(function(){
                                            res.cookie('auth',{name: user.username,token:token});
                                            /*res.json({
                                              success: true,
                                              message: 'Enjoy your token!',
                                              token: token
                                            });*/ 
                                            res.redirect('/products');
                                        });
                                    });
        });
    });

authRouter
    .route('/logout')
    .get(function(req, res){
        var db = req.db;
        var auth = db.get("tbl_auth");
        auth.remove({token: req.cookies.auth.token}).then(function(err){ res.redirect("/");});
        res.clearCookie('auth');
    });
    
authRouter
    .route('/login')
    .get(function(req, res){
       
        res.render("login",{message: req.flash("message")});
    })
    .post(function(req, res){
        var db = req.db;
        var users = db.get('tbl_user');
        users.findOne({username: req.body.username},
                      function(err, user){
                        //if(err) throw err;
                
                        if(!user){
                           // res.json({ success: false, message: 'Authentication failed. User not found.' });
                            req.flash("message", 'Authentication failed. User not found.' );
                            res.redirect("/auth/login");
                        }
                        else if(user){
                            if(user.password != req.body.password){
                                //res.json({ success: false, message: 'Authentication failed. User not found.' });
                                req.flash("message", 'Authentication failed. Password not correct.' );
                                res.redirect("/auth/login");
                            }else{
                                var token = jwt.sign(user, config.secret,{
                                    expiresInMinutes: 1
                                });
                                var auth = db.get("tbl_auth");
                                auth
                                    .remove({user_id: user._id})
                                    .then(function(err){
                                        auth.insert({
                                            user_id: user._id,
                                            token: token,
                                            expire: false })
                                        .then(function(){
                                            res.cookie('auth',{name: user.username, token:token});
                                            /*res.json({
                                              success: true,
                                              message: 'Enjoy your token!',
                                              token: token
                                            });*/ 
                                            res.redirect('/products');
                                        });
                                    });
                            }
                        }
                    })
    });


module.exports = authRouter;