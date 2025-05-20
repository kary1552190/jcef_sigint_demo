# Web SSH Terminal

This project provides a web-based SSH terminal using [xterm.js](https://xtermjs.org/) for the frontend and a Node.js WebSocket-to-SSH bridge for the backend. It allows users to interact with a remote SSH server directly from their browser.

## Project Structure

- **server.js**: Node.js backend that bridges WebSocket and SSH.
- **xterm.js**: Frontend logic for the terminal, using xterm.js.
- **xterm.html**: The HTML page to load the terminal in the browser.
- **.env**: Environment variables for SSH connection (host, port, username, password, private key).

## Prerequisites

- Node.js (v14 or above recommended)
- npm

## 1. Start the Server

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with your SSH connection details:

   ```env
   cp .env.example .env
   # modify .env with your ssh machine info
   ```

3. Start the server:

   ```bash
   node server/server.js
   ```

   The server will listen on `ws://localhost:8080` for WebSocket connections from the frontend.

## 2. Start the Frontend (Web Page)

1. For default browsers like Chrome/Firefox, open `xterm.html` file directly.

1. For IntelliJ JCEF Browser:
    1. Tools | Internal Actions | Browse Web
    1. Input `file:///Absolute/path/to/xterm.html`

**Note:**
If you want to connect to a different WebSocket server, simply modify the WebSocket address in `xterm.js` (look for the line `const socket = new WebSocket('ws://localhost:8080');`).
