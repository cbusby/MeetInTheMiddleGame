const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const cors = require("cors");

app.use(cors());

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const rooms = {};

io.on("connection", (socket) => {
  socket.on("createRoom", (roomId) => {
    rooms[roomId] = { players: [] };
    socket.join(roomId);
    console.log(rooms);
    socket.emit("roomCreated", roomId);
  });

  socket.on("joinRoom", (roomId) => {
    console.log("Room id: ", roomId);
    if (rooms[roomId] && !rooms[roomId].players.includes(socket.id)) {
      rooms[roomId].players.push(socket.id);
      console.log(rooms[roomId]);
      socket.join(roomId);
      console.log("sending updatePlayers with ", rooms[roomId].players);
      io.to(roomId).emit("updatePlayers", rooms[roomId].players);
    } else {
      socket.emit("roomNotFound");
    }
  });

  socket.on("leaveGame", (roomId, playerId) => {
    console.log("Player leaving game");

    const index = rooms[roomId]?.players.indexOf(playerId) ?? -1;
    if (index !== -1) {
      rooms[roomId].players.splice(index, 1); // Remove the player from the room
      if (rooms[roomId].players.length === 0) {
        console.log("No players left in ", roomId, ". Closing room...");
        delete rooms[roomId];
      } else {
        io.to(roomId).emit("updatePlayers", rooms[roomId].players); // Notify remaining players
      }
    }
    console.log("Sending leave game ack");
    socket.emit("leaveGameAck");
  });

  socket.on("disconnect", (reason) => {
    console.log("Disconnect reason: ", reason);
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
