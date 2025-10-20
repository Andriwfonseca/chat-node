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

io.on('connection', (socket) => {
  console.log('Um usuário se conectou: ', socket.id);

  
});