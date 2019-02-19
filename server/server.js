// server.js
var Server = require('ws').Server;
var port = 8000;
var ws = new Server({port: port});
var receiver;

console.log("server started")

ws.on('connection', function(w){
  w.on('message', function(msg){
    console.log('message from client: ', msg);
    // receiver message initially sent by receiver
    // so server knows exactly where to send things
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