// Import required modules
const express = require('express');
const http = require('http');
var socketIO = require("socket.io");

// Create a new Express application
const app = express();
const server = http.createServer(app);

// Create a new Socket.IO instance
const io = socketIO(server);

// Serve static files from the "public" directory
app.use(express.static('public'));

// Route handler for the home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Store connected users
const users = {};

// // Socket.IO event handling
io.on('connection', (socket) => {

  // Handle new user joining the chat
  socket.on('join', (username) => {
    users[socket.id] = username;
    socket.broadcast.emit('user joined', username);
  });
  
    // Handle chat messages
  socket.on('chat message', (message) => {
     username = users[socket.id]
    io.emit('chat message', { username, message });
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    const username = users[socket.id];
    socket.broadcast.emit('user left', username);
    delete users[socket.id];
  });
})

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
