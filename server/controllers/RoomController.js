const Room = require('../models/Room');
const generatePIN = require('../utils/pinGenerator');

const rooms = {};

function RoomController(io) {
  io.on('connection', (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id}`);

    // Crear sala
    socket.on('createRoom', ({ limit, nickname }, callback) => {
      const existingPins = Object.keys(rooms);
      const pin = generatePIN(existingPins);
      const room = new Room(pin, limit);
      rooms[pin] = room;
      room.addUser(socket.id, nickname);
      socket.join(pin);

      console.log(`Sala creada con PIN: ${pin} por ${nickname}`);

      io.to(pin).emit('userJoined', { userId: socket.id, nickname, count: room.users.length, limit: room.limit });
      callback({ success: true, pin });
    });

    // Unirse a sala
    socket.on('joinRoom', ({ pin, nickname }, callback) => {
      const room = rooms[pin];
      if (!room) return callback({ success: false, message: 'PIN inválido.' });
      if (room.isFull()) {
        socket.emit('roomFull', { pin, limit: room.limit });
        return callback({ success: false, message: 'La sala está llena.' });
      }

      room.addUser(socket.id, nickname);
      socket.join(pin);

      io.to(pin).emit('userJoined', { userId: socket.id, nickname, count: room.users.length, limit: room.limit });
      callback({ success: true, pin });
    });

    // Enviar mensaje
    socket.on('chatMessage', ({ pin, text }) => {
      const room = rooms[pin];
      if (!room) return;

      const user = room.users.find(u => u.id === socket.id);
      const sender = user ? user.nickname : 'Anónimo';
      io.to(pin).emit('chatMessage', { sender, text });
    });

    // Salir de sala
    socket.on('leaveRoom', ({ pin }) => {
      const room = rooms[pin];
      if (!room) return;

      const user = room.users.find(u => u.id === socket.id);
      const nickname = user ? user.nickname : 'Desconocido';
      room.removeUser(socket.id);
      socket.leave(pin);

      if (room.isEmpty()) {
        delete rooms[pin];
        console.log(`Sala ${pin} eliminada por estar vacía`);
      } else {
        io.to(pin).emit('userLeft', { userId: socket.id, nickname, count: room.users.length, limit: room.limit });
      }
    });

    // Desconexión
    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`);
      for (const pin in rooms) {
        const room = rooms[pin];
        const user = room.users.find(u => u.id === socket.id);
        const nickname = user ? user.nickname : 'Desconocido';

        if (user) {
          room.removeUser(socket.id);
          socket.leave(pin);

          if (room.isEmpty()) {
            delete rooms[pin];
            console.log(`Sala ${pin} eliminada por estar vacía`);
          } else {
            io.to(pin).emit('userLeft', { userId: socket.id, nickname, count: room.users.length, limit: room.limit });
          }
        }
      }
    });
  });
}

module.exports = RoomController;
