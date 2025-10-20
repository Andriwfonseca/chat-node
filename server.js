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

let connectedUsers = [];

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

    socket.broadcast.emit('list-update', {
      joined: username,
      list: connectedUsers
    });

    socket.on('disconnect', () => {
      connectedUsers = connectedUsers.filter(user => user != username);
      console.log('Usuários conectados: ', connectedUsers);

      socket.broadcast.emit('list-update', {
        left: username,
        list: connectedUsers
      });
    });
  });

  socket.on('send-message', (message) => {
    let objectMessage = {
      username: socket.username,
      message: message
    };

    socket.broadcast.emit('new-message', objectMessage);
  });
});