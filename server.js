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
  socket.on('server_toggle', (msg) => {
    console.log('server_toggle: ' + msg);
    io.emit('user_toggle', msg)
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

server.listen(3000, () => {
  console.log('listening on *:3000');
});