import { post } from "../services/apiClient.js";
import { showError } from "../services/errors.js";
import { showMessage } from "../services/ui-messages.js";
import { validateForm } from "../utils/validation.js";
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footerNav.js";

const basePath = window.location.hostname.includes("github.io")
  ? "/sippr-app"
  : "";

const createForm = document.getElementById("create-form");

createForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const isValid = validateForm(createForm);

  if (!isValid) return;

  await uploadPost(createForm);
});

async function uploadPost(form) {
  const formData = new FormData(form);
  const url = formData.get("img-url")?.trim();
  const alt = formData.get("img-alt")?.trim();

  const body = {
    title: formData.get("title"),
    body: formData.get("caption"),
  };

  if (url) {
    body.media = {
      url,
      alt: alt || "",
    };
  }

  const submitBtn = document.getElementById("submit-btn");
  submitBtn.disabled = true;

  try {
    await post("/social/posts", body);
    showMessage("Upload was successful!");
    setTimeout(() => {
      window.location.href = `${basePath}/feed.html`;
    }, 1000);
  } catch (error) {
    showError(error?.message || "Upload failed");
  } finally {
    submitBtn.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
});
