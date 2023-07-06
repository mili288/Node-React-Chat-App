import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import io from "socket.io-client";
import { useNavigate } from 'react-router-dom';
import './Chat.css';

function Chat({ username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [socket, setSocket] = useState(null);
  const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Connect to the server-side socket.io
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    // Clean up the socket connection on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      // Join the chat room
      socket.emit("join_room", { gameId: room, userId: username });

      // Listen for received messages
      socket.on("receive_message", (messages) => {
        // Update the message list only if the initial messages have been loaded
        if (initialMessagesLoaded) {
          setMessageList(messages);
        }
      });
    }
  }, [socket, room, username, initialMessagesLoaded]);

  useEffect(() => {
    // Fetch the initial messages when the component mounts
    fetch(`http://localhost:3001/messages/${room}`)
      .then((response) => response.json())
      .then((data) => {
        setMessageList(data);
        setInitialMessagesLoaded(true);
      })
      .catch((error) => {
        console.error("Error retrieving messages:", error);
      });
  }, [room]);

  const sendMessage = () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
        userId: username, // Pass the user ID
      };

      socket.emit("send_message", messageData);

      setCurrentMessage("");
    }
  };

  const clearMessages = () => {
    socket.emit("leave_room", { gameId: room, userId: username });
    setMessageList([]);
    setInitialMessagesLoaded(false);
    window.location.reload(false);
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => (
            <div
              className="message"
              key={index}
              id={username === messageContent.author ? "you" : "other"}
            >
              <div>
                <div className="message-content">
                  <p>{messageContent.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{messageContent.time}</p>
                  <p id="author">{messageContent.author}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button className="bruh" style={{ fontSize: '20px', fontWeight: 'bold' }} onClick={sendMessage}>Send</button>
        <button style={{ fontSize: '16px', fontWeight: 'bold' }} className="bruh" onClick={clearMessages}>Leave Room</button>
      </div>
    </div>
  );
}

export default Chat;
