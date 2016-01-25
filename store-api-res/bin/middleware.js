var jwt = require('jsonwebtoken');
var config = require('./config');

module.exports = function(req, res, next) {

    // check header or url parameters or post parameters for token
    
    var auth = req.cookies.auth;
    var token = "";
      
    if(!auth)
        token = req.body.token || req.query.token || req.headers['x-access-token'];
    else
        token = auth.token;
    // decode token
    if (token) {
        
        // verifies secret and checks exp
        jwt.verify(token, config.secret, function(err, decoded) {      
            if (err) {
                res.redirect("/auth/login");
               /* return res.status(403).send({ 
                    success: false, 
                    message: 'No token provided.' 
                });*/
                //return res.json({ success: false, message: 'Failed to authenticate token.' });    
            } else {
            // if everything is good, save to request for use in other routes
                req.decoded = decoded;  
                req.username = auth.name;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        res.redirect("/auth/login");
        /*return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });*/
    }
};