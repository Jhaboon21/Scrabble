"use strict";

const app = require("./app");
const dotenv = require('dotenv');
dotenv.config();
const { PORT } = require("./config");
const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

let players = [];
wss.on('connection', socket => {
  console.log('A player connected');

  // Add player to the list
  players.push(socket);
  

  socket.on('message', message => {
    // Handle message from clients
    console.log('Received message', JSON.parse(message));

    // Broadcast the message to all connected clients
    wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.parse(message))
    }
  })
  })

  socket.on('close', () => {
    console.log('A player disconnected');
    // Handle player disconnect
    players = players.filter(player => player != socket);
  })
})

app.server = app.listen(PORT, function () {
    console.log(`Started on http://localhost:${PORT}`);
});

app.server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    })
})