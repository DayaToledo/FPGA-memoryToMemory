const socketPath = VERCEL_URL || "http://localhost:3000";
const socket = io(socketPath);

let username;
let roomName;

socket.on('hasOpponent', (opponentName) => {
  console.log({ username, opponentName });
  if (username !== opponentName) {
    socket.emit('sendUsername', { username, roomName });
    window.location = '/game';
  }
});

const handleInitDocument = () => {
  username = sessionStorage.getItem('USERNAME');
  roomName = sessionStorage.getItem('ROOMNAME');
  socket.emit('sendUsername', { username, roomName });
}

$(document).ready(handleInitDocument);
