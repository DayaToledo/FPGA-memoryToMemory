let message;

const handleInitDocument = () => {
  message = sessionStorage.getItem('FINAL_MESSAGE');
  document.querySelector("main h1").innerHTML = message;

  const btnRestart = document.getElementById("restart");
  btnRestart.onclick = () => window.location = '/';
}

$(document).ready(handleInitDocument);
