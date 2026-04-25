import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import './jobs/appointmentStatusJob.js';
import './jobs/usersStatusJob.js';

// Create HTTP server
const server = http.createServer(app);

// SOCKET.IO SETUP
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Make socket.io globally accessible
global.io = io;

// Socket events
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User registers to a room (national_id)
  socket.on('register', (national_id) => {
    socket.join(String(national_id));
    console.log(`User joined room ${national_id}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running with Socket.io on port ${PORT}`);
});
