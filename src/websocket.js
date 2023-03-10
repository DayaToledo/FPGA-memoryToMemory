import server from "./http.js";
import { Server } from "socket.io";

const io = new Server(server);

let rooms = {};

const getPlayerNames = (roomName) =>
  Object.keys(rooms[roomName]).filter((key) =>
    !["qntdPlayers", "clientPlaying", "messages"].includes(key)
  );

const sortitionFirstPlayer = ({ roomName }) => {
  const playerNames = getPlayerNames(roomName);
  const numberSorted = Math.floor(Math.random() * 2);
  console.log({ playerNames, numberSorted })
  return playerNames[numberSorted];
};

const setAllFalse = ({ roomName }) => {
  for (const username in rooms[roomName])
    if (Object.hasOwnProperty.call(rooms[roomName], username))
      if (!["qntdPlayers", "clientPlaying", "messages"].includes(username))
        rooms[roomName][username].playing = false;
}

const setOtherTrue = ({ username, roomName }) => {
  for (const name in rooms[roomName])
    if (Object.hasOwnProperty.call(rooms[roomName], name))
      if (!["qntdPlayers", "clientPlaying", "messages", username].includes(name))
        rooms[roomName][name].playing = true;
}

const getRoomNames = () => Object.keys(rooms);

const getRoomsWithSpace = () => {
  const roomsWithSpace = [];
  for (const roomName in rooms) {
    if (Object.hasOwnProperty.call(rooms, roomName)) {
      if (!rooms[roomName].qntdPlayers)
        delete rooms[roomName];
      else if (rooms[roomName].qntdPlayers < 2)
        roomsWithSpace.push(roomName);
    }
  }
  return roomsWithSpace;
}

io.of("/rooms").on("connection", (socket) => {
  console.log(`>> Connected socket ${socket.id} in /rooms`);
  
  socket.on("getRoomsInfos", () => {
    const roomsWithSpace = getRoomsWithSpace();
    const existingRooms = getRoomNames();
    socket.emit("sendRoomsInfos", { roomsWithSpace, existingRooms });
  })

  socket.on("enterRoom", ({ username, roomName }) => {
    console.log({ username, roomName });
    if (!rooms[roomName])
      rooms[roomName] = {
        qntdPlayers: 0,
        clientPlaying: undefined,
        messages: [],
      };

    rooms[roomName].qntdPlayers += 1;
    rooms[roomName][username] = {
      name: username,
      playing: false,
      socketId: socket.id,
    };

    const roomsWithSpace = getRoomsWithSpace();
    const existingRooms = getRoomNames();
    socket.broadcast.emit("sendRoomsInfos", { roomsWithSpace, existingRooms });
  });
  
  socket.on("disconnect", (reason) => {
    console.log(`>> Disconnect socket ${socket.id} in /rooms by reason: ${reason}`);
  });
});

io.of("/waiting").on("connection", (socket) => {
  console.log(`>> Connected socket ${socket.id} in /waiting`);
  
  socket.on("sendUsername", ({ username, roomName }) => {
    socket.join(roomName);
    socket.to(roomName).emit("hasOpponent", username);
  });
  
  socket.on("disconnect", (reason) => {
    console.log(`>> Disconnect socket ${socket.id} in /waiting by reason: ${reason}`);
  });
});

const gameNamespace = io.of("/game");

gameNamespace.on("connection", (socket) => {
  const { username, roomName } = socket.handshake.query;
  console.log(`>> Connected ${username} in the room ${roomName} with socketId ${socket.id} in /game`);
  
  socket.join(roomName);
  if (rooms[roomName] && rooms[roomName][username]) 
    rooms[roomName][username].socketId = socket.id;

  socket.on("initGame", ({ username, roomName }) => {
    socket.join(roomName);
    console.log(`>> The player ${username} was connected in the room ${roomName}`);

    rooms[roomName][username].socketId = socket.id;
    console.log(rooms[roomName]);
    const { qntdPlayers, clientPlaying } = rooms[roomName];

    console.log({ qntdPlayers, clientPlaying });
    if (!clientPlaying && qntdPlayers >= 2) {
      setAllFalse({ roomName });
      const clientSorted = sortitionFirstPlayer({ roomName });
      rooms[roomName].clientPlaying = clientSorted;
      rooms[roomName][clientSorted].playing = true;
    }
    gameNamespace.to(roomName).emit("updatePlayers", { players: rooms[roomName] });
    gameNamespace.to(socket.id).emit("previousMessages", rooms[roomName].messages);
  });

  socket.on("passGame", ({ username, roomName }) => {
    rooms[roomName][username].playing = false;
    setOtherTrue({ username, roomName });
    gameNamespace.to(roomName).emit("updatePlayers", { players: rooms[roomName] });
  });

  socket.on("sendMessage", data => {
    const { roomName } = data;
    console.log(`>> Message received by server:`);
    console.log(data);

    delete data.roomName;
    rooms[roomName].messages.push(data);
    gameNamespace.to(roomName).emit("receivedMessage", [data]);
  });

  socket.on("sendCards", data => {
    const { myCard, opponentCard, username, roomName } = data;
    rooms[roomName][username].myCard = myCard;
    rooms[roomName][username].opponentCard = opponentCard;
    gameNamespace.to(roomName).emit("receivedCards", { myCard, opponentCard, username });
  });

  socket.on("sendResult", ({ isWinner, roomName }) => {
    socket.to(roomName).emit("receivedResult", isWinner);
  });

  socket.on("disconnectGame", ({ username, roomName }) => {
    console.log(`>> Disconnected player ${username} in the room ${roomName}`);
    rooms[roomName][username].socketId = "";
    const notPlayers = ["qntdPlayers", "clientPlaying", "messages", username];

    for (const name in rooms[roomName])
      if (Object.hasOwnProperty.call(rooms[roomName], name))
        if (!notPlayers.includes(name) && rooms[roomName][name]?.socketId)
          socket.to(rooms[roomName][name].socketId).emit("exitGame");
  });
  
  socket.on("disconnect", (reason) => {
    console.log(`>> Disconnect socket ${socket.id} in /game by reason: ${reason}`);
  });
});

io.of("/").adapter.on("create-room", (room) => {
  if (rooms[room])
    console.log(`>> Room ${room} was created`);
});

io.of("/").adapter.on("delete-room", (room) => {
  if (rooms[room])
    console.log(`>> Room ${room} was deleted`);
});