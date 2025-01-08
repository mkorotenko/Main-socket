const WebSocket = require('ws');

const wsServer = new WebSocket.Server({ port: 8080 });
wsServer.binaryType = "arraybuffer";

wsServer.on('connection', (ws) => {
  console.log('Peer connection established');
  ws.binaryType = "arraybuffer";

  ws.on('message', (message) => {
    // const decoder = new TextDecoder('utf-8');
    // decoder.decode(new Uint8Array(m))
    console.log('Peer message:', message);

    // Розсилаємо повідомлення всім підключеним клієнтам, виключаючи відправника
    wsServer.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Peer connection closed');
    ws.send('Peer connection closed');
    wsServer.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send('Some peer closed');
      }
    });
  });

  ws.on('error', (error) => {
    console.error('Peer WebSocket error:', error);
    ws.send('Peer WebSocket error:', error);
  });

  // ws.send('Connection established');
  wsServer.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send('New peer connected');
    }
  });
});

console.log('WebSocket server is running on ws://localhost:8080');