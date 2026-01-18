const form = document.getElementById("resetForm");
const message = document.getElementById("message");

const emailRegex = /\S+@\S+\.\S+/;

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
});
