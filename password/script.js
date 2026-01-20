const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const sheet_id = params.get("sheet_id");

const form = document.getElementById("resetForm");
const message = document.getElementById("message");

const emailRegex = /\S+@\S+\.\S+/;


const url_api = "https://script.google.com/macros/s/AKfycbzQBHptF66yaBXNuJEb5xXElwuh9d5tSM0ekMhy_ehTGvVfC1bmKAlOXHDnwDosi2_9/exec"
const requestOptionsGet = {
  method: "GET",
  redirect: "follow"
};


function togglePassword(inputId, el) {
  const input = document.getElementById(inputId);
  const isPassword = input.type === "password";

  input.type = isPassword ? "text" : "password";
  el.textContent = isPassword ? "🙈" : "👁️";
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  message.style.color = "red";

  if (!emailRegex.test(email)) {
    message.textContent = "Email invalide";
    return;
  }

  if (password.length < 6) {
    message.textContent = "Mot de passe trop court (6 caractères min)";
    return;
  }

  if (password !== confirmPassword) {
    message.textContent = "Les mots de passe ne correspondent pas";
    return;
  }

  message.style.color = "green";
  message.textContent = "Mot de passe réinitialisé avec succès";

    reinit_password(email, password)

  
});



function reinit_password(email, password){

    data = JSON.stringify({
      "mdp": emailCo,
      "password": passwordCo
    })

    data_encode = encodeURIComponent(data)

    etat = "get_userFirebase_info"
    getUrl = `${url_api}?info=${data_encode}&etat=${etat}`
    fetch(getUrl, requestOptionsGet)
      .then((response) => response.json())
      .then((get_data) => {
        
      })
  
}











