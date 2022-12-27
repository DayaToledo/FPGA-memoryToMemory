const socket = io(siteUrl);

let roomsWithSpace;
let existingRooms;
let roomNameSelected;

const enterInExistingRoom = () => {
  const username = sessionStorage.getItem('USERNAME');
  sessionStorage.setItem("ROOMNAME", roomNameSelected);
  socket.emit("enterRoom", { username, roomName: roomNameSelected });
  window.location = "/waiting";
}

const selectRoom = (event) => {
  const elem = event.target || event.srcElement;
  console.log(elem.id);
  roomNameSelected = elem.id;
  const modal = document.getElementById("modal-confirm");
  modal.querySelector('p').innerHTML = `Tem certeza que deseja acessar a sala?<br>Sala escolhida: ${roomNameSelected}`;

  const btnYes = document.getElementById("yes");
  btnYes.onclick = enterInExistingRoom;

  modal.style.display = "flex";
}

const addButtonsRooms = () => {
  const div = document.querySelector("#buttons");

  if (roomsWithSpace.length) {
    const h2 = document.querySelector("main h2");
    h2.innerHTML = "Entre em uma sala para jogar!";
  }

  for (const roomName of roomsWithSpace) {
    const room = document.createElement("button");
    room.setAttribute("id", roomName);
    room.innerHTML = roomName;
    room.onclick = selectRoom;
    div.append(room);
  }
};

socket.on("sendRoomsInfos", (data) => {
  console.log(data);
  ({ roomsWithSpace, existingRooms } = data);
  addButtonsRooms();
});

const handleInitDocument = () => {
  sessionStorage.removeItem("ALREADY_INIT_GAME");

  const btnNewRoom = document.getElementById("new-room");
  const modalNewRoom = document.getElementById("modal-newRoom");
  const modalConfirm = document.getElementById("modal-confirm");
  const btnNo = document.getElementById("no");
  const btnYes = document.getElementById("yes");
  const btnClose = document.getElementById("btn-close-modal");

  socket.emit("getRoomsInfos");

  btnNewRoom.onclick = () => (modalNewRoom.style.display = "flex");
  btnClose.onclick = () => (modalNewRoom.style.display = "none");
  btnNo.onclick = () => (modalConfirm.style.display = "none");
  btnYes.onclick = () => (window.location = "/");

  window.onclick = (event) => {
    if (event.target == modalConfirm) {
      modalConfirm.style.display = "none";
    }
    if (event.target == modalNewRoom) {
      modalNewRoom.style.display = "none";
    }
  };
};

$(document).ready(handleInitDocument);

const createNewRoom = () => {
  event.preventDefault();
  const roomName = $("#form-room input[name=room]").val();

  if (existingRooms.includes(roomName)) {
    document.querySelector("#form-room input[name=room]").value = '';
    alert("Sala já existe! Escolha outro nome!");
  } else {
    const username = sessionStorage.getItem('USERNAME');
    sessionStorage.setItem("ROOMNAME", roomName);
    socket.emit("enterRoom", { username, roomName });
    window.location = "/waiting";
  }
};

$("#form-room").submit(createNewRoom);