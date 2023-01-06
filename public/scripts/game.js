import items from "../data/memories.js";
let socket;
let opponentCard;
let myCard;
let username;
let roomName;
let arePlaying;

let availableLifes = 3;
const discardCards = [];

const verifyCards = (data) => {
  // console.log(data);
  if (data.username !== username) {
    opponentCard = data.myCard;
    if (!data.opponentCard)
      socket.emit("sendCards", {
        myCard: data.myCard,
        opponentCard: myCard,
        username: data.username,
        roomName
      });
  } else {
    ({ opponentCard } = data);
  }
}

const finishedGame = (message) => {
  sessionStorage.setItem("FINAL_MESSAGE", message);
  window.location = "/end";
}

const renderMessage = (messages) => {
  console.log(`Mensagem recebida no client`);
  console.log(messages);
  for (let message of messages) {
    const className = message.username === username ? "message my" : "message";
    $(".messages").append(`<div class="${className}"><strong>${message.username}</strong><br>${message.message}</div>`);
  }
};

const verifyResult = (isWinner) => {
  // console.log(isWinner);
  if (isWinner) finishedGame("O outro jogador acertou sua carta! <br> Você perdeu!");
  else finishedGame("O outro jogador perdeu todas as vidas! <br> Você ganhou!");
}

const updatePlayers = ({ players }) => {
  arePlaying = players[username].playing;
  let innerHTML;

  if (arePlaying) {
    innerHTML = "Está na sua vez de jogar!";
    $("#pass-game").css("display", "block");
  } else {
    innerHTML = "Espere seu oponente jogar!";
    $("#pass-game").css("display", "none");
  }

  document.querySelector("aside h3").innerHTML = innerHTML;
}



const getAndRenderAndSendMessage = () => {
  event.preventDefault();
  const message = document.querySelector("input[name=message]").value;

  console.log(`Mensagem digitada: ${message}`);
  if (message.length) {
    var messageObject = {
      username,
      roomName,
      message,
    };

    socket.emit("sendMessage", messageObject);
  } 
  document.querySelector("input[name=message]").value = "";
}

const changeMoreDetailsVisibility = (visibility, isProfileCard) => {
  if (visibility !== "flex" || arePlaying || isProfileCard)
    $("#more-details").css("display", visibility);
}

const verifyAndDiscardCard = (id) => {
  discardCards.push(id);
  $(`#${id}`).css("opacity", "0.5");

  changeMoreDetailsVisibility("none");

  const availableCards = Array.from(
    document.querySelectorAll("#cards .card")
  ).filter((card) => (card.style.opacity !== "0.5"))
    .length;

  if (!availableCards || !availableLifes)
    socket.emit("sendResult", { isWinner: false, username, roomName });

  if (!availableCards) finishedGame("Acabaram os cards! <br> Você perdeu!");
  else if (!availableLifes) finishedGame("Acabaram as vidas! <br> Você perdeu!");

};

const retireLife = () => {
  const div = document.querySelector("div.lifes");
  div.removeChild(div.firstElementChild);
  availableLifes -= 1;
  console.log(`Total lifes: ${availableLifes}`);
};

const handleDiscardCard = () => {
  const id = $("#more-details").attr("name");
  console.log(`Discarding card id: ${id}`);
  verifyAndDiscardCard(id);
};

const handlePassGame = () => socket.emit("passGame", { username, roomName });

const handleModalMessage = (message) => {
  const modal = document.getElementById("modal-box");
  modal.style.display = "flex";
  modal.querySelector("p").innerHTML = message;
}

const handleKickCard = () => {
  // console.log(opponentCard);
  const opponentId = opponentCard && opponentCard.id ? opponentCard.id : null;
  const kickId = Number($("#more-details").attr("name"));
  console.log(`Kicking card id: ${kickId}`);
  console.log(`OpponentId card id: ${opponentId}`);

  if (kickId === opponentId) {
    socket.emit("sendResult", { isWinner: true, username, roomName });
    finishedGame("Acertou a carta! <br> Você venceu!");
  } else {
    handleModalMessage(`Errou o chute! <br> Sobraram ${availableLifes - 1} vidas!`);
    retireLife();
    verifyAndDiscardCard(kickId);
    handlePassGame();
  }
};

const setInfosToCard = ({ id, name, path, description }) => {
  document.querySelector("#more-details").setAttribute("name", id);
  document.querySelector("#more-details strong").innerHTML = name;
  document.querySelector("#more-details img").src = path;

  const list = document.querySelector("#more-details ul");

  description.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = item;
    list.append(li);
  });
};

const addButtonsToCard = ({ isDisabled }) => {
  const div = document.querySelector("#more-details-buttons");

  if (!div.firstElementChild && !isDisabled) {
    const kick = document.createElement("button");
    kick.setAttribute("id", "kick");
    kick.setAttribute("type", "button");
    kick.onclick = handleKickCard;
    kick.innerHTML = "Chutar";
    div.append(kick);

    const discard = document.createElement("button");
    discard.setAttribute("id", "discard");
    discard.setAttribute("type", "button");
    discard.onclick = handleDiscardCard;
    discard.innerHTML = "Descartar";
    div.append(discard);
  }
};

const positionCard = ({ top, left }) => {
  const cardHeight = Number($("#more-details").css("height").replace("px", ""));
  const bodyHeight = Number($("body").css("height").replace("px", ""));

  top = top > (bodyHeight - cardHeight) ? (bodyHeight - cardHeight) - 10 : top;

  $("#more-details").css("top", top);
  $("#more-details").css("left", left);
};

const clearElements = ({ isDisabled }) => {
  document.querySelector("#more-details strong").innerHTML = "";
  document.querySelector("#more-details img").src = "";

  const li = document.querySelector("#more-details ul");
  while (li.firstElementChild) {
    li.removeChild(li.firstElementChild);
  }

  const div = document.querySelector("#more-details-buttons");

  while (div.firstElementChild && isDisabled) {
    div.removeChild(div.firstElementChild);
  }
};

const getParams = ({ elem }) => {
  const id = elem.prop("id");
  const isDisabled = elem.css("opacity") === "0.5";
  const left = elem.offset().left;
  let top = elem.offset().top;

  const { name, description, path } = items[id];

  return { name, description, path, isDisabled, top, left, id };
};

function handleCardProfileHoverIn () {
  const id = $(this).prop("id");
  let top = $(this).offset().top;
  const isProfile = $(this).parent().text().includes("Sua carta:");
  const { name, description, path } = myCard;

  clearElements({ isDisabled: true });
  
  const cardHeight = Number($("#more-details").css("height").replace("px", ""));
  const cardWidth = Number($("#more-details").css("width").replace("px", ""));
  const bodyHeight = Number($("body").css("height").replace("px", ""));
  const bodyWidth = Number($("body").css("width").replace("px", ""));

  const newTop = top > (bodyHeight - cardHeight) ? (bodyHeight - cardHeight) - 10 : top;
  const newLeft = (bodyWidth - cardWidth);

  $("#more-details").css("top", newTop);
  $("#more-details").css("left", newLeft);
  setInfosToCard({ id, name, path, description });

  changeMoreDetailsVisibility("flex", isProfile);
};

function handleCardHoverIn () {
  const elem = $(this);
  const { name, description, path, isDisabled, top, left, id } = getParams({ elem });

  clearElements({ isDisabled });
  positionCard({ top, left });
  addButtonsToCard({ isDisabled });
  setInfosToCard({ id, name, path, description });

  changeMoreDetailsVisibility("flex");
};

function handleCardHoverOut () { changeMoreDetailsVisibility("none") };
function handleMoreDetailsHoverOut () { changeMoreDetailsVisibility("none") };
function handleMoreDetailsHoverIn () {
  const isProfile = $(this).parent().text().includes("Sua carta:");
  changeMoreDetailsVisibility("flex", isProfile); 
};

const sortitionCard = () => {
  const totalCards = Object.keys(items).length;
  const sortedCardNumber = Math.floor(Math.random() * totalCards) + 1;
  console.log(`Sorted card has number ${sortedCardNumber}`);
  const sortedCard = items[sortedCardNumber];
  sortedCard.id = sortedCardNumber;
  return sortedCard;
}

const reloadAndRedirect = () => {
  document.querySelector("#modal-box-bye button").onclick = () =>{ 
    socket.emit("disconnectGame", { username, roomName });
    window.location = "/"
  };
  document.getElementById("modal-box-welcome").style.display = "none";
  document.getElementById("modal-box-bye").style.display = "flex";
  sessionStorage.removeItem("ALREADY_INIT_GAME");
}

const setDinamicInfos = () => {
  sessionStorage.setItem("ALREADY_INIT_GAME", "true");

  socket.emit("initGame", { username, roomName });

  for (let index = 0; index < availableLifes; index++) {
    const div = document.querySelector("div.lifes");
    const img = document.createElement("img");

    img.setAttribute("src", "/assets/heart.png");
    img.setAttribute("alt", "icone de um coração");
    div.append(img);
  }
  myCard = sortitionCard();
  document.querySelector("#profile .card img").setAttribute("src", myCard.path);
  document.querySelector("#profile .card p").innerHTML = myCard.name;
  document.querySelector("#profile .card").setAttribute("id", myCard.id);
  socket.emit("sendCards", { myCard, opponentCard, username, roomName });

  const modal = document.getElementById("modal-box");
  const modalWelcome = document.getElementById("modal-box-welcome");
  const span = document.getElementById("btn-close-modal");
  const btnPassGame = document.getElementById("pass-game");
  const btnOKWelcome = document.querySelector("#modal-box-welcome button");

  span.onclick = () => modal.style.display = "none";
  btnOKWelcome.onclick = () => modalWelcome.style.display = "none";
  btnPassGame.onclick = handlePassGame;

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

const handleInitDocument = () => {
  const siteURL = document.querySelector("body h6").innerHTML;
  console.log(siteURL);
  socket = io(siteURL);
  username = sessionStorage.getItem("USERNAME");
  roomName = sessionStorage.getItem("ROOMNAME");

  const alreadyInitGame = sessionStorage.getItem("ALREADY_INIT_GAME");
  if (alreadyInitGame) {
    reloadAndRedirect();
    return;
  }

  socket.on("getUserAndRoom", () => { 
    socket.emit("setUserAndRoom", { username, roomName });
  });

  socket.on("exitGame", () => finishedGame("O outro jogador desistiu do jogo! <br> Você ganhou!"));
  
  socket.on("updatePlayers", updatePlayers);
  
  socket.on("receivedCards", verifyCards);

  socket.on("previousMessages", renderMessage);
  
  socket.on("receivedMessage", renderMessage);
  
  socket.on("receivedResult", verifyResult);
  
  setDinamicInfos();
  $("#cards .card").hover(handleCardHoverIn, handleCardHoverOut);
  $("#profile .card").hover(handleCardProfileHoverIn, handleCardHoverOut);
  $("#more-details").hover(handleMoreDetailsHoverIn, handleMoreDetailsHoverOut);
  $("#chat").submit(getAndRenderAndSendMessage);
}

$(document).ready(handleInitDocument);