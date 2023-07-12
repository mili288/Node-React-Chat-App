import "./Lobby.css";
import io from "socket.io-client";
import { useState, useEffect } from "react";
import Chat from "../components/Chat";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const socket = io.connect("https://mobile-app-chat.onrender.com");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  const joinRandomGame = () => {
    if (username !== "") {
      const data = { gameId: "5", userId: username };
      socket.emit("join_game", data);
      setShowChat(true);
      setRoom("5");
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Room</h3>
          <h4>Welcome, {username}!</h4>
          <input
            type="text"
            value={username}
            readOnly
            hidden={true}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Custom Room</button><h4>or</h4>
          <button onClick={joinRandomGame}>Join A Public Room</button><br /><br />
          <button onClick={() => {localStorage.removeItem('token'), localStorage.removeItem('userId'), navigate('/login')}}>Logout</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
