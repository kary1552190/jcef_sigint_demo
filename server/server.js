const WebSocket = require('ws');
const { Client } = require('ssh2');
const fs = require('fs');
require('dotenv').config();

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  const conn = new Client();

  conn.on('ready', () => {
    conn.shell((err, stream) => {
      if (err) {
        ws.send('SSH shell error: ' + err.message);
        ws.close();
        return;
      }
      // SSH -> WebSocket
      stream.on('data', (data) => ws.send(data.toString('utf8')));
      stream.on('close', () => ws.close());
      // WebSocket -> SSH
      ws.on('message', (msg) => stream.write(msg));
      ws.on('close', () => conn.end());
    });
  }).connect({
    host: process.env.SSH_HOST,
    port: process.env.SSH_PORT ? parseInt(process.env.SSH_PORT) : 22,
    username: process.env.SSH_USERNAME,
    password: process.env.SSH_PASSWORD,
    privateKey: process.env.SSH_PRIVATE_KEY_FILE_PATH ? fs.readFileSync(process.env.SSH_PRIVATE_KEY_FILE_PATH) : undefined,
  });

  conn.on('error', (err) => {
    ws.send('SSH connection error: ' + err.message);
    ws.close();
  });
});

console.log('WebSocket SSH bridge listening on ws://localhost:8080');
