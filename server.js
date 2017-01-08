var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

connections = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
  // connection
  connections.push(socket);
  console.log('A user connected. Online users:', connections.length);
  socket.emit('connection', 'new user', connections.length);

  // disconnect
  socket.on('disconnect', function(data){
    connections.splice(connections.indexOf(socket), 1);
    console.log('A user disconnected. Online users:', connections.length);
    io.emit('disconnect', data, connections.length);
  });

  // send message
  socket.on('chat message', function(mgs){
    console.log('message:' + mgs);
    io.emit('chat message', mgs);
  });
});

http.listen(3000, function(){
  console.log('Listening on *3000');
});
