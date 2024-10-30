const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("client connected: ", socket.id);

  socket.on("createRoom", (roomId) => {
    rooms[roomId] = { players: [] };
    socket.join(roomId);
    console.log(rooms);
    socket.emit("roomCreated", roomId);
  });

  socket.on("joinRoom", (roomId) => {
    if (rooms[roomId]) {
      rooms[roomId].players.push(socket.id);
      socket.join(roomId);
      io.to(roomId).emit("playerJoined", socket.id); // Notify all clients in the room
      io.to(roomId).emit("updatePlayers", rooms[roomId].players);
    } else {
      socket.emit("roomNotFound");
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(reason);
    for (const roomId in rooms) {
      const index = rooms[roomId].players.indexOf(socket.id);
      if (index !== -1) {
        rooms[roomId].players.splice(index, 1); // Remove the player from the room
        io.to(roomId).emit("updatePlayers", rooms[roomId].players); // Notify remaining players
        break;
      }
    }
  });
});

server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log("Server running on Port ", PORT);
});
