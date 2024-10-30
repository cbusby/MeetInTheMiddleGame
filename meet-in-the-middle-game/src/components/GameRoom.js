// src/GameRoom.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const GameRoom = ({ onJoinRoom, playerJoined }) => {
  const { roomId } = useParams();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Automatically join the room when the component mounts
    onJoinRoom(roomId);
  }, [roomId, onJoinRoom]);

  // Listen for updates to the player list
  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("updatePlayers", (playerList) => {
      setPlayers(playerList); // Update the state with the new player list
    });

    return () => {
      socket.disconnect(); // Clean up the socket connection
    };
  }, []);

  return (
    <div>
      <h1>Room ID: {roomId}</h1>
      <h2>Players in this room:</h2>
      <ul>
        {players.map((playerId) => (
          <li key={playerId}>{playerId}</li>
        ))}
      </ul>
    </div>
  );
};

export default GameRoom;
