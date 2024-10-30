// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import io from "socket.io-client";
import Welcome from "../Welcome";
import GameRoom from "../GameRoom";

const socket = io("http://localhost:4000");

function App() {
  const [roomId, setRoomId] = useState("");
  const [playerJoined, setPlayerJoined] = useState(false);

  const createRoom = (id) => {
    socket.emit("createRoom", id);
  };

  useEffect(() => {
    socket.on("roomCreated", (id) => {
      setRoomId(id);
    });

    socket.on("playerJoined", (id) => {
      setPlayerJoined(true);
    });

    return () => {
      socket.off("roomCreated");
      socket.off("playerJoined");
    };
  }, []);

  const joinRoom = (roomId) => {
    socket.emit("joinRoom", roomId);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Welcome onCreateRoom={createRoom} roomId={roomId} />}
        />
        <Route
          path="/room/:roomId"
          element={
            <GameRoom
              roomId={roomId}
              onJoinRoom={joinRoom}
              playerJoined={playerJoined}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
