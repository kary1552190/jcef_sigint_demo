// ====== DOM Elements & Ctrl+C Button ======
function createSigintButton(socket) {
  const btn = document.createElement('button');
  btn.textContent = 'Send Ctrl+C';
  btn.style.margin = '16px 0 8px 0';
  btn.onclick = () => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send('\u0003');
    }
  };
  document.body.insertBefore(btn, document.getElementById('terminal'));
}

// ====== Terminal & WebSocket Logic ======
const term = new Terminal({
  cursorBlink: true,
  fontSize: 14,
  theme: { background: '#1e1e1e' },
});
term.open(document.getElementById('terminal'));

const socket = new WebSocket('ws://localhost:8080');
createSigintButton(socket);

socket.onopen = () => term.write('WebSocket connected.\r\n');
socket.onclose = () => term.write('\r\nWebSocket disconnected.\r\n');
socket.onerror = () => term.write('\r\nWebSocket error.\r\n');
socket.onmessage = (event) => term.write(event.data);

term.onData((data) => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(data);
  }
});

// ====== Keyboard Event Debugging (Optional) ======
term.attachCustomKeyEventHandler((e) => {
  showToast(`ctrlKey: ${e.ctrlKey}, shiftKey: ${e.shiftKey}, code: ${e.code}`);
  return true;
});

// ====== Toast Notification Queue ======
const toastQueue = [];
let toastActive = false;

function showToast(msg) {
  toastQueue.push(msg);
  if (!toastActive) showNextToast();
}

function showNextToast() {
  if (toastQueue.length === 0) {
    toastActive = false;
    return;
  }
  toastActive = true;
  const msg = toastQueue.shift();
  let toast = document.getElementById('xterm-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'xterm-toast';
    Object.assign(toast.style, {
      position: 'fixed',
      top: '32px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0,0,0,0.85)',
      color: '#fff',
      padding: '10px 24px',
      borderRadius: '6px',
      fontSize: '16px',
      zIndex: 9999,
      boxShadow: '0 2px 8px #222',
    });
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
    showNextToast();
  }, 300);
}
