let socket;
let username;
let roomName;

const handleInitDocument = () => {
  const siteURL = document.querySelector("body h6").innerHTML;
  console.log(siteURL);
  socket = io(siteURL);
  
  username = sessionStorage.getItem('USERNAME');
  roomName = sessionStorage.getItem('ROOMNAME');

  socket.emit('sendUsername', { username, roomName });

  socket.on('hasOpponent', (opponentName) => {
    console.log({ username, opponentName });
    if (username !== opponentName) {
      socket.emit('sendUsername', { username, roomName });
      window.location = '/game';
    }
  });
}

$(document).ready(handleInitDocument);
