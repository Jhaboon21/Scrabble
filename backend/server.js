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
  wss.clients.forEach(client => {
    if (client !== socket && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'system',
        content: 'A new user has joined the room'
      }))
    }
  })


  socket.on('message', message => {
    // Handle message from clients
    // console.log('Received message', JSON.parse(message));

    handleMessage(JSON.parse(message));
  })

  socket.on('close', () => {
    console.log('A player disconnected');
    // Handle player disconnect
    players = players.filter(player => player != socket);
  })
})

function handleMessage(message) {
  switch (message.type) {
    case 'grid':
      // Broadcast the message to all connected clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'board',
            content: message.content
          }))
        } else {
          console.error('WebSocket connection is not open.');
        }
      })
      break;
    case 'turn':
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'turn',
            content: message.content
          }))
        } else {
          console.error('WebSocket connection is not open.');
        }
      })
      break;
    case 'game':
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'game',
            content: message.content
          }))
        } else {
          console.error('WebSocket connection is not open.');
        }
      })
      break;
    case 'end':
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'end',
            content: message.content
          }))
        } else {
          console.error('WebSocket connection is not open');
        }
      })
      break;
    case 'finish':
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'finish',
            content: message.content
          }))
        } else {
          console.error('WebSocket connection is not open');
        }
      })
      break;
  }
}

app.server = app.listen(PORT, function () {
  console.log(`Started on http://localhost:${PORT}`);
});

app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  })
})