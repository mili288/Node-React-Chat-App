import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { Messages } from '../models/Messages.js';
import { LocalStorage } from "node-localstorage";
import * as dotenv from 'dotenv';

const app = express();
app.use(cors());
dotenv.config()

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN,
    methods: ['GET', 'POST'],
  },
});


// Store the active game rooms and their participants
const gameRooms = {};

 // Retrieve the user ID from local storage
const userId = localStorage.getItem('userId');


io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);


  socket.on('join_room', (data) => {
    const { gameId, userId } = data;

     // Check if the game room exists
     if (gameId in gameRooms) {
      const gameRoom = gameRooms[gameId];

      // Add the user to the game's participant list
      gameRoom.participants.push(userId);

      // Check if the game room is now full
      if (gameRoom.participants.length === 10) {
        // Start the chat and emit the start event
        io.to(gameId).emit('game_start');
      }
    } else {
      // Create a new game room and add the user as the first participant
      gameRooms[gameId] = {
        participants: [userId],
      };
    }

    socket.join(gameId);
    console.log(`User with ID: ${userId} joined room: ${gameId}`);
  });


  socket.on('join_game', (data) => {
    const { gameId, userId } = data;

     // Check if the game room exists
     if (gameId in gameRooms) {
      const gameRoom = gameRooms[gameId];

      // Add the user to the game's participant list
      gameRoom.participants.push(userId);

      // Check if the game room is now full
      if (gameRoom.participants.length === 10) {
        // Start the chat and emit the start event
        io.to(gameId).emit('game_start');
      }
    } else {
      // Create a new game room and add the user as the first participant
      gameRooms[gameId] = {
        participants: [userId],
      };
    }

    socket.join(gameId);
    console.log(`User with ID: ${userId} joined room: ${gameId}`);
  });


 socket.on('send_message', async (data) => {
  const { room, author, message, time, userId } = data;

  try {
    const newMessage = new Messages({
      room: room,
      author: author,
      message: message,
      time: time,
      userId: userId,
    });

    await newMessage.save();

    // Retrieve all messages for the room after saving the new message
    const messages = await Messages.find({ room: room });
    

    io.to(room).emit('receive_message', messages);
  } catch (error) {
    console.error('Error saving message to the database:', error);
  }
});




socket.on('leave_room', async (data) => {
  const { gameId, userId } = data;
  
  try {
    // Delete all messages from the user in the specified room
    await Messages.deleteMany({ room: gameId, author: userId });
    
    console.log(`Deleted messages from user ${userId} in room ${gameId}`);
  } catch (error) {
    console.error('Error deleting messages from the database:', error);
  }
  
  // Remove the user from the game room
  if (gameId in gameRooms) {
    const gameRoom = gameRooms[gameId];
    const index = gameRoom.participants.indexOf(userId);
    if (index !== -1) {
      gameRoom.participants.splice(index, 1);
      
      // Check if the game room becomes empty
      if (gameRoom.participants.length === 0) {
        delete gameRooms[gameId];
      }
    }
  }
  
  socket.leave(gameId);
  console.log(`User with ID: ${userId} left room: ${gameId}`);
});



  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
    // Remove the user from any active game room
    for (const roomId in gameRooms) {
      const participants = gameRooms[roomId].participants;
      const index = participants.indexOf(socket.id);
      if (index !== -1) {
        participants.splice(index, 1);
        // Check if the game room becomes empty
        if (participants.length === 0) {
          delete gameRooms[roomId];
        }
        break;
      }
    }
  });
});



// API endpoint to retrieve messages from the database
app.get('/messages/:room', async (req, res) => {
  const { room } = req.params;

  try {
    // Retrieve messages for the specified room from the database
    const messages = await Messages.find({ room });

    res.json(messages);
  } catch (error) {
    console.error('Error retrieving messages from the database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



server.listen(3001, () => {
  console.log('SERVER RUNNING');
});

const router = express.Router();

export default router;
