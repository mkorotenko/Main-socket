const WebSocket = require('ws');
import { updateManager } from './update-manager.mjs';

const port = 8080;

const wsServer = new WebSocket.Server({ port });
wsServer.binaryType = "arraybuffer";

const decoder = new TextDecoder('utf-8');

function tryDecode(data) {
  try {
    // return JSON.parse(data);
    return decoder.decode(new Uint8Array(data));
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return undefined;
  }
}

wsServer.on('connection', (ws) => {
  console.log('Peer connection established');
  ws.binaryType = "arraybuffer";

  // ws.on('open', () => {
  //   console.log('Peer connection opened');
    setTimeout(() => {
      console.log('Sending peer connection opened');
      ws.send('Peer connection opened');
    });
  // });

  ws.on('message', (message) => {
    // const decoder = new TextDecoder('utf-8');
    // decoder.decode(new Uint8Array(m))
    const data = tryDecode(message);
    if (data) {
      console.log('Peer data:', data);
      if (data.call) {
        switch (data.call) {
            case 'update':
                console.log('Update call');
                updateManager();
                break;
        }
        return;
      }
    } else {
      console.log('Peer message:', message);
    }

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

console.log(`WebSocket server is running on port ${port}`);