// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import io from "socket.io-client";
import Welcome from "../Welcome";
import GameRoom from "../GameRoom";

const socket = io("http://localhost:4000");

function App() {
  const [roomId, setRoomId] = useState("");

  const createRoom = (id) => {
    console.log("Create room with id: ", id);
    socket.emit("createRoom", id);
  };

  useEffect(() => {
    socket.on("roomCreated", (id) => {
      setRoomId(id);
    });

    return () => {
      socket.off("roomCreated");
    };
  }, []);

  const joinRoom = (roomId) => {
    console.log("Someone joined room", roomId);
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
            <GameRoom roomId={roomId} onJoinRoom={joinRoom} socket={socket} />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
