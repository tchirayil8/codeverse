// server.js
var Server = require('ws').Server;
var port = 8000;
var ws = new Server({port: port});
var receiver;

ws.on('connection', function(w){
  w.on('message', function(msg){
    console.log('message from client: ', msg);
    if (msg == "receiver"){
      receiver = w;
    }
    else{
      receiver.send(msg)
    }
  });
  w.on('close', function() {
    console.log('closing connection');
  });
});