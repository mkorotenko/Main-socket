const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New connection established');

  ws.on('message', (message) => {
    console.log('Received:', message);

    // Розсилаємо повідомлення всім підключеним клієнтам, включаючи відправника
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Connection closed');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  ws.send('Welcome to the WebSocket server');
});

console.log('WebSocket server is running on ws://localhost:8080');