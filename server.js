const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
wss.binaryType = "arraybuffer";

wss.on('connection', (ws) => {
  console.log('New peer connection established');

  ws.on('message', (message) => {
    console.log('Peer message:', message);

    // Розсилаємо повідомлення всім підключеним клієнтам, виключаючи відправника
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Peer connection closed');
    ws.send('Peer connection closed');
  });

  ws.on('error', (error) => {
    console.error('Peer WebSocket error:', error);
    ws.send('Peer WebSocket error:', error);
  });

  ws.send('Connection established');
});

console.log('WebSocket server is running on ws://localhost:8080');