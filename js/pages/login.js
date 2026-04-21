import { validateForm } from "../utils/validation.js";
import { loginUser } from "../services/authService.js";
import { showError } from "../services/errors.js";
import { showMessage } from "../services/ui-messages.js";

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const isValid = validateForm(loginForm);

  if (!isValid) return;

  await handleLogin();
});

async function handleLogin() {
  // collect login data
  const formData = new FormData(loginForm);
  const body = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  // save credentials
  try {
    await loginUser(body);
    showMessage("Login was successful!");
    setTimeout(() => {
      window.location.href = "../../feed.html";
    }, 1000);
  } catch (error) {
    showError(error.message || "Login failed");
  }
}
