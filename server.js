const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname + '/'));


io.on('connection', (socket) => {
  //console.log('a user connected');
  socket.on('master_start', (msg) => {
    io.to(msg).emit('user_start', msg)
  });
  socket.on('master_stop', (msg) => {
    io.to(msg).emit('user_stop', msg)
  });
  socket.on('server_bpm', (msg) => {
    console.log(msg.ID)
    console.log(msg.BPM)
    io.to(msg.ID).emit('user_bpm', msg.BPM)
  });
  socket.on('ping', (msg) => {
    io.to(msg.ID).emit('user_ping', msg.start)
  })
  // socket.on('server_bpmeasure', (msg) => {
  //   console.log("server_bpmeasure" + msg)
  //   io.emit('user_bpmeasure', msg)
  // });
  socket.on('join_room', (msg) => {
    if(io.sockets.adapter.rooms.has(msg.room))
    {
      console.log("joined room " + msg.room)
      io.to(msg.id).emit("joined", socket.id, msg)
      socket.join(msg.room);
      setTimeout(function(){ 
        io.to(msg.id).emit('user_stop', msg)
      }, 100)
      
    }
    else{
      console.log(msg)
      console.log("room " + msg.room + " not found")
      io.to(msg.id).emit("not found", msg)
    }
    
  })
  socket.on('create_room', (msg) => {
    console.log("created room: " + msg)
    socket.join(msg);
  })
});

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/lobby', function(req, res){
  res.sendFile(path.join(__dirname + '/pages/lobby.html'));
});
app.get('/server_met', function(req, res){
  res.sendFile(path.join(__dirname + '/pages/server_met.html'));
});
app.get('/user_met', function(req, res){
  res.sendFile(path.join(__dirname + '/pages/user_met.html'));
});
app.get('/waiting', function(req, res){
  res.sendFile(path.join(__dirname + '/pages/waiting.html'));
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

server.listen(port, () => {
  console.log('listening on *:' + port);
});
