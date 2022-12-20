import items from "./data.js";

var socket = io('http://localhost:3000');

let opponentCard;
let myCard;
let username;
let arePlaying;

let availableLifes = 3;
const discardCards = [];

socket.on('receivedCards', (data) => {
  ({ opponentCard } = data);
  if (!data.myCard) socket.emit('sendCards', { myCard, opponentCard });
  console.log(data);
});

const handleModalMessage = (message) => {
  const modal = document.getElementById("modal-box");
  modal.style.display = "flex";
  modal.querySelector("p").innerHTML = message;
}

const finishedGame = (message) => {
  sessionStorage.setItem("FINAL_MESSAGE", message);
  window.location = '/end';
}

const renderMessage = (messages) => {
  for (let message of messages) {
    const className = message.username === username ? "message my" : "message";
    $('.messages').append(`<div class="${className}"><strong>${message.username}</strong><br>${message.message}</div>`);
  }
};

const verifyResult = (isWinner) => {
  console.log(isWinner);
  if (isWinner) finishedGame("O outro jogador acertou sua carta! <br> Você perdeu!");
  else finishedGame("O outro jogador perdeu todas as vidas! <br> Você ganhou!");
}

const updatePlayer = ({ players }) => {
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

socket.on('previousMessages', renderMessage);

socket.on('receivedMessage', renderMessage);

socket.on('receivedResult', verifyResult);

socket.on('updatePlayers', updatePlayer);

const getAndRenderAndSendMessage = () => {
  event.preventDefault();
  var message = $('input[name=message]').val();
  document.querySelector('input[name=message]').innerHTML = '';

  if (message.length) {
    var messageObject = {
      username,
      message: message,
    };
  }

  renderMessage([messageObject]);
  socket.emit('sendMessage', messageObject);
}

$('#chat').submit(getAndRenderAndSendMessage);

const verifyAndDiscardCard = (id) => {
  discardCards.push(id);
  $(`#${id}`).css("opacity", '0.5');

  $("#more-details").css("display", "none");

  const availableCards = Array.from(
    document.querySelectorAll("#cards .card")
  ).filter((card) => (card.style.opacity !== '0.5'))
    .length;

  if (!availableCards || !availableLifes) socket.emit('sendResult', false);

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
  const id = $("#more-details").attr('name');
  console.log(`Discarding card id: ${id}`);
  verifyAndDiscardCard(id);
};

const handleKickCard = () => {
  const opponentId = opponentCard && opponentCard.id ? opponentCard.id : null;
  const kickId = Number($("#more-details").attr('name'));
  console.log(`Kicking card id: ${kickId}`);
  console.log(`OpponentId card id: ${opponentId}`);

  if (kickId === opponentId) {
    socket.emit('sendResult', true);
    finishedGame("Acertou a carta! <br> Você venceu!");
  } else {
    handleModalMessage(`Errou o chute! <br> Sobraram ${availableLifes - 1} vidas!`);
    retireLife();
    verifyAndDiscardCard(kickId);
    handlePassGame();
  }
};

const handlePassGame = () => {
  socket.emit('passGame', username);
}

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
  const cardHeight = Number($("#more-details").css('height').replace("px", ""));
  const bodyHeight = Number($("body").css('height').replace("px", ""));

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
  const id = elem.prop('id');
  const isDisabled = elem.css('opacity') === '0.5';
  const left = elem.offset().left;
  let top = elem.offset().top;

  const { name, description, path } = items[id];

  return { name, description, path, isDisabled, top, left, id };
};

function handleCardHoverIn() {
  const elem = $(this);
  const { name, description, path, isDisabled, top, left, id } = getParams({ elem });

  clearElements({ isDisabled });
  positionCard({ top, left });
  addButtonsToCard({ isDisabled });
  setInfosToCard({ id, name, path, description });

  if (arePlaying) $("#more-details").css("display", "flex");
};

const sortitionCard = () => {
  const totalCards = Object.keys(items).length;
  const sortedCardNumber = Math.floor(Math.random() * totalCards) + 1;
  console.log(`Sorted card has number ${sortedCardNumber}`);
  const sortedCard = items[sortedCardNumber];
  sortedCard.id = sortedCardNumber;
  return sortedCard;
}

const handleInitDocument = () => {
  console.log("Depois do reload");

  username = sessionStorage.getItem('USERNAME');

  socket.emit('initGame', username);

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
  socket.emit('sendCards', { myCard, opponentCard });

  const modal = document.getElementById("modal-box");
  const span = document.getElementById("btn-close-modal");
  const btnPassGame = document.getElementById("pass-game");

  span.onclick = () => modal.style.display = "none";
  btnPassGame.onclick = handlePassGame;

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

const handleCardHoverOut = () => $("#more-details").css("display", "none");
const handleMoreDetailsHoverOut = () => $("#more-details").css("display", "none");
const handleMoreDetailsHoverIn = () => {
  if (arePlaying) $("#more-details").css("display", "flex");
};


$('#cards .card').hover(handleCardHoverIn, handleCardHoverOut);
$("#more-details").hover(handleMoreDetailsHoverIn, handleMoreDetailsHoverOut);
$(document).ready(handleInitDocument);

window.onbeforeunload = () => {
  console.log("Antes do reload");
};