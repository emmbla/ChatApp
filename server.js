const express = require('express');
const app = express();
const http = require('http');

const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

let rooms = [
  {
    id: 'Livingroom',
    password: 'password',
  },
  {
    id: 'Kitchen',
    password: '',
  },
];

// öppnar localhost
io.on('connection', (socket) => {
  console.log('User connected: ', socket.id);
  io.emit('rooms', getAllRooms());

  // skickar ett meddelande
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // // Skapar ett rum
  socket.on('create room', (data) => {
    rooms.push({ id: data.room, password: data.password });
    io.emit('rooms', getAllRooms());

    return rooms;
  });

  socket.on('join', function (room) {
    socket.join(room);
    socket.emit('join success', 'success');
  });

  // När man stänger flik
  socket.on('disconnect', () => {
    console.log('User disconnected: ', socket.id);
  });
});

function getAllRooms() {
  console.log(rooms);
  return rooms;
}

server.listen(3000, () =>
  console.log('Server is running at: http://localhost:3000')
);
