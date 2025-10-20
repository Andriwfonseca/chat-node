const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

const connectedUsers = [];

io.on('connection', (socket) => {
  console.log('Um usuário se conectou: ', socket.id);


  socket.on('join-room-request', (username) => {
    socket.username = username;

    connectedUsers.push(username);

    console.log('Usuários conectados: ', connectedUsers);

    socket.emit('join-room-response', {
      success: true,
      users: connectedUsers
    });
  });
});