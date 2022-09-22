const express = require('express');
const timesyncServer = require('timesync/server')
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use('/timesync/', express.static(path.join(__dirname, '/../../../dist')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname + '/'));

app.use('/timesync', timesyncServer.requestHandler);

// var interval;
// var counter = 0;
// var total = 0;
io.on('connection', (socket) => {
  //console.log('a user connected');
  socket.on('master_start', (msg) => {
    io.to(msg.roomID).emit('user_start', msg.start)
  });
  socket.on('master_stop', (msg) => {
    io.to(msg).emit('user_stop', msg)
  });
  socket.on('server_bpm', (msg) => {
    console.log(msg.roomID)
    console.log(msg.BPM)
    io.to(msg.roomID).emit('user_bpm', msg.BPM)
  });
  socket.on('join_room', (msg) => {
    if(io.sockets.adapter.rooms.has(msg.roomID))
    {
      console.log("joined room " + msg.roomID)
      io.to(msg.socketID).emit("joined", msg)
      socket.join(msg.roomID);
      setTimeout(function(){ 
        io.to(msg.socketID).emit('user_stop', msg)
      }, 100)
      // interval = setInterval(() => {
      //   const start = Date.now();
      
      //   io.to(msg.id).emit("ping", start)
      // }, 10);
    }
    else{
      console.log(msg)
      console.log("room " + msg.roomID + " not found")
      io.to(msg.socketID).emit("not found", msg)
    }
    
  })
  socket.on('create_room', (msg) => {
    if(io.sockets.adapter.rooms.has(msg.roomID))
    {
      io.to(msg.socketID).emit('room taken', msg)
    }
    else
    {
      console.log("created room: " + msg)
      socket.join(msg.roomID);
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
  socket.on('timesync', function (data) {
    console.log('message', data);
    socket.emit('timesync', {
      id: data && 'id' in data ? data.id : null,
      result: Date.now()
    });
  });
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

io.on('connection', function (socket) {
  
});

// app.post('/timesync', function (req, res) {
//   var data = {
//     id: (req.body && 'id' in req.body) ? req.body.id : null,
//     result: Date.now()
//   };
//   res.json(data);
// });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

server.listen(port, () => {
  console.log('listening on *:' + port);
});
