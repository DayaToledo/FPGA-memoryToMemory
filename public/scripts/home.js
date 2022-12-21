const handleInitDocument = () => {
  const startBtn = document.getElementById("start");
  const rulesBtn = document.getElementById("rules");
  const aboutBtn = document.getElementById("about");

  const modal = document.getElementById("modal-box");
  const span = document.getElementById("btn-close-modal");

  span.onclick = () => modal.style.display = "none";
  startBtn.onclick = () => modal.style.display = "flex";
  rulesBtn.onclick = () => window.location = '/rules';
  aboutBtn.onclick = () => window.location = '/about';

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

$(document).ready(handleInitDocument);

const getAndSubmitUser = () => { 
  event.preventDefault(); 
  const username = $('input[name=username]').val(); 
  sessionStorage.setItem("USERNAME", username);
  window.location = '/waiting';
}

$('#form-username').submit(getAndSubmitUser);
