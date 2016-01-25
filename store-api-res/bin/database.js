var mongo = require('mongodb');
var monk = require('monk');

// Server Name
var server_name = 'localhost';

// Server Port
var server_port = '27017';

// Database Name
var database_name = 'store_api';

// Connection server 
var db = monk(server_name+':'+server_port+'/'+database_name);

module.exports = db;