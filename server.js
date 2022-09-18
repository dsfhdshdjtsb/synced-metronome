const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { isBoolean } = require('tone');
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname + '/'));

var interval;
var counter = 0;
// var total = 0;
io.on('connection', (socket) => {
  //console.log('a user connected');
  socket.on('master_start', (msg) => {

    io.to(msg).emit('start_ping', msg)
    io.to(msg).emit('user_start', Date.now() + 500)
    // setTimeout(function(){ 
    //   io.to(msg).emit('user_start', Date.now() + 500)
    // }, 10)


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
    console.log(msg)
    io.to(msg.ID).emit('ping', msg)
  })
  socket.on('join_room', (msg) => {
    if(io.sockets.adapter.rooms.has(msg.room))
    {
      console.log("joined room " + msg.room)
      io.to(msg.id).emit("joined", socket.id, msg)
      socket.join(msg.room);
      setTimeout(function(){ 
        io.to(msg.id).emit('user_stop', msg)
      }, 100)
      // interval = setInterval(() => {
      //   const start = Date.now();
      
      //   io.to(msg.id).emit("ping", start)
      // }, 10);
    }
    else{
      console.log(msg)
      console.log("room " + msg.room + " not found")
      io.to(msg.id).emit("not found", msg)
    }
  })
  socket.on('get_time', (msg) => {
    console.log('get time');
    io.to(msg.ID).emit("time", Date.now());
  })
  socket.on('create_room', (msg) => {
    console.log("created room: " + msg)
    if(io.sockets.adapter.rooms.has(msg.room))
    {
      io.to(msg.id).emit('room taken', msg)
    }
    else
    {
      socket.join(msg.room);
    }
    
  })

  // socket.on('ping', (msg) => {
  //   let delay = Date.now() - msg.start
  //   console.log(delay);
  //   counter++
  //   total += delay;
  //   if(counter > 100)
  //   {
  //     io.to(msg.id).emit("result", total/counter)
  //     counter = 0;
  //     total = 0;
  //     clearInterval(interval)
  //   }
  // })
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
