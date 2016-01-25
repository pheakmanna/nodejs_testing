"use strict";
module.exports = function(server){
    let i = 1;
    let io = require('socket.io')(server);
    let allClients = [];
    io.on('connection',function(socket){
        console.log('user '+(i++)+' connected ');
        socket.on('notification', function(msg){
            //io.emit("notification", msg);
            io.emit("notification",msg);
        });
        
        allClients.push(socket);

        socket.on('disconnect', function() {
            console.log('Got disconnect!');
            let j = allClients.indexOf(socket);
            allClients.splice(j, 1);
            i--;
        });
        //socket.broadcast.emit("notify everyone",{user : "test"});
    });
    io.on('disconnect', function () { 
        console.log('user '+(i++)+' disconnected ');
    });
    return {
        io: io
    }
}

