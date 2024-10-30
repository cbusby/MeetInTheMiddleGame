// src/Welcome.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Welcome = ({ onCreateRoom, roomId }) => {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    const roomId = Math.random().toString(36).replace("0.", "");
    onCreateRoom(roomId);
  };

  // Use an effect to navigate when the roomId changes
  useEffect(() => {
    if (roomId) {
      navigate(`/room/${roomId}`);
    }
  }, [roomId, navigate]);

  return (
    <div>
      <h1>Welcome to the Game</h1>
      <button onClick={handleCreateRoom}>Create Room</button>
    </div>
  );
};

export default Welcome;
