// src/GameRoom.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const GameRoom = ({ onJoinRoom, socket }) => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [players, setPlayers] = useState([]);
  const [leaveRoom, setLeaveRoom] = useState(false);

  useEffect(() => {
    // Automatically join the room when the component mounts
    onJoinRoom(roomId);
  }, [roomId, onJoinRoom]);

  // Listen for updates to the player list
  useEffect(() => {
    const updatePlayersHandler = (playerList) => {
      console.log("Received player list:", playerList);
      setPlayers(playerList); // Update the state with the new player list
    };

    socket.on("updatePlayers", updatePlayersHandler);

    return () => {
      console.log("socket off");
      socket.off("updatePlayers", updatePlayersHandler); // Clean up the specific listener
    };
  }, []);

  useEffect(() => {
    if (leaveRoom) {
      socket.emit("leaveGame", roomId, socket.id);
      navigate("/");
    }
  }, [leaveRoom, navigate]);

  function handleLeaveGame() {
    setLeaveRoom(true);
  }

  return (
    <div>
      <h1>Room ID: {roomId}</h1>
      <h2>Players in this room:</h2>
      <ul>
        {players.map((playerId) => (
          <li key={playerId}>{playerId}</li>
        ))}
      </ul>
      <button onClick={() => handleLeaveGame()}>Leave Game</button>
    </div>
  );
};

export default GameRoom;
