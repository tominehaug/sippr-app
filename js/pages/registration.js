import { validateForm } from "../utils/validation.js";
import { post } from "../services/apiClient.js";
import { showMessage } from "../services/ui-messages.js";
import { showError } from "../services/errors.js";

const basePath = window.location.hostname.includes("github.io")
  ? "/sippr-app"
  : "";

const registrationForm = document.getElementById("registration-form");

registrationForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const isValid = validateForm(registrationForm);
  const isMatching = checkMatchingPwd();

  if (!isValid || !isMatching) return;

  await handleRegistration();
});

/**
 * Confirm password by checking if repeated password is the same as first password.
 * @returns {boolean} true if the input from both password fields are matching, false if not
 * @example
 * 
 js
 * // password = "mypassword123"
 * // confirmPwd = "mypassword123"
 * checkMatchingPwd();
 * // Expected result: true
 * 
 * @example
 * 
 js
 * // password = "mypassword123"
 * // confirmPwd = "differentpassword"
 * checkMatchingPwd();
 * // Expected result: false
 */

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
    bio: formData.get("bio") || "",
    avatar: {
      url: formData.get("profileImg") || "",
      alt: "profile image",
    },
  };
  console.log("REGISTER BODY:", body);
  // send request
  try {
    await post("/auth/register", body);
    showMessage("Registration was successful!");
    setTimeout(() => {
      window.location.href = `${basePath}/login.html`;
    }, 1000);
  } catch (error) {
    showError(error.message || "Registration failed");
  }
}
