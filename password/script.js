const form = document.getElementById("resetForm");
const message = document.getElementById("message");

const emailRegex = /\S+@\S+\.\S+/;

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
    message.textContent = "Le mot de passe doit contenir au moins 6 caractères";
    return;
  }

  if (password !== confirmPassword) {
    message.textContent = "Les mots de passe ne correspondent pas";
    return;
  }

  // 👉 Ici tu branches Firebase ou ton API
  message.style.color = "green";
  message.textContent = "Mot de passe réinitialisé avec succès";
});
