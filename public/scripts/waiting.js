var socket = io('http://localhost:3000'); // conecta com socket do backend

let username;

socket.on('hasOpponent', (opponentName) => { // recebe as mensagens enviadas para todos os sockets da aplicacao
  console.log({ username, opponentName });
  if (username !== opponentName) {
    socket.emit('sendUsername', username);
    window.location = '/game';
  }
});

const handleInitDocument = () => {
  username = sessionStorage.getItem('USERNAME');
  socket.emit('sendUsername', username);
}

$(document).ready(handleInitDocument);
