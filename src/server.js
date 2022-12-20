import express from 'express'; 
import nunjucks from 'nunjucks'; 


import { pageHome, pageGame, pageWaiting, pageEnd, pageRules } from './pages.js';

const app = express(); 

nunjucks.configure('src/views', {
    express: app,
    noCache: true,
})

app.use(express.static("public"));
app.get("/", pageHome);
app.get("/waiting", pageWaiting);
app.get("/game", pageGame);
app.get("/end", pageEnd);
app.get("/rules", pageRules);

import { createServer } from 'http';
import { Server } from 'socket.io';

const server = createServer(app); 
const io = new Server(server); 

const messages = []; 
let clients = {};
let qntdSockets = 0;
let myCard;
let opponentCard;
let clientPlaying;

const sortitionFirstPlayer = () => {
  const clientsNames = Object.keys(clients);
  const numberSorted = Math.floor(Math.random() * 2);
  console.log({ clientsNames, numberSorted })
  return clientsNames[numberSorted];
}; 

const setAllFalse = () => {
  for (const username in clients) {
    if (Object.hasOwnProperty.call(clients, username)) {
      clients[username].playing = false;
    }
  }
}

const setOtherTrue = (name) => {
  for (const username in clients) {
    if (Object.hasOwnProperty.call(clients, username)) {
      if (username !== name) 
        clients[username].playing = true;
    }
  }
}

io.on('connection', socket => { 
  qntdSockets++;

  socket.on('sendUsername', username => {
    socket.broadcast.emit('hasOpponent', username); 
  });

  socket.on('initGame', (username) => {
    console.log({ qntdSockets, conectedSocket: socket.id });

    if (!clients[username]) 
      clients[username] = { 
        name: username, 
        playing: false 
      };
    clients[username].socketId = socket.id;
    
    const qntdClients = Object.keys(clients).length;
    if (!clientPlaying && qntdClients >= 2) {
      setAllFalse();
      clientPlaying = sortitionFirstPlayer();
      clients[clientPlaying].playing = true;
    }
    socket.broadcast.emit('updatePlayers', { players: clients }); 
    socket.emit('updatePlayers', { players: clients }); 
  });

  socket.on('passGame', username => {
    clients[username].playing = false;
    setOtherTrue(username);
    socket.broadcast.emit('updatePlayers', { players: clients }); 
    socket.emit('updatePlayers', { players: clients }); 
  });

  socket.emit('previousMessages', messages); 

  socket.on('sendMessage', data => { 
    messages.push(data); 
    socket.broadcast.emit('receivedMessage', [data]); 
  });

  socket.on('sendCards', data => { 
    ({ myCard, opponentCard } = data); 
    socket.broadcast.emit('receivedCards', { myCard: opponentCard, opponentCard: myCard }); 
    
  });

  socket.on('sendResult', isWinner => { 
    socket.broadcast.emit('receivedResult', isWinner); 
  });

  socket.on('disconnect', () => {
    qntdSockets--;
    console.log({ qntdSockets, disconnectedSocket: socket.id });
    for (const username in clients) {
      if (Object.hasOwnProperty.call(clients, username)) {
        const { socketId } = clients[username];
        if (socketId !== socket.id) 
          clients[username].socketId = '';
      }
    }
  });
});

server.listen(3000); 