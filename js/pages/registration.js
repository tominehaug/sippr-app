import { validateForm } from "../utils/validation";
import { post } from "../services/apiClient.js";

const registrationForm = document.getElementById("registration-form");

registrationForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const isValid = validateForm(registrationForm);
  const isMatching = checkMatchingPwd();

  if (!isValid || !isMatching) return;

  await handleRegistration();
});

function checkMatchingPwd() {
  const password = registrationForm.elements.password.value;
  const confirm = registrationForm.elements.confirmPwd.value;
  const confirmErrorDiv =
    registrationForm.elements.confirmPwd.nextElementSibling;

  if (password !== confirm) {
    confirmErrorDiv.textContent = "Passwords don't match";
    return false;
  }
  confirmErrorDiv.textContent = "";
  return true;
}

async function handleRegistration() {
  // collect registration data
  const formData = new FormData(registrationForm);
  const body = {
    name: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
  // send request
  try {
    await post("/auth/register", body);
    window.location.href = "../../feed.html";
  } catch (error) {
    showError(error.message || "Registration failed");
  }
}
