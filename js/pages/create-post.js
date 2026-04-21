import { post } from "../services/apiClient.js";
import { showError } from "../services/errors.js";
import { showMessage } from "../services/ui-messages.js";
import { validateForm } from "../utils/validation.js";

const createForm = document.getElementById("create-form");

createForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const isValid = validateForm(createForm);

  if (!isValid) return;

  await uploadPost(createForm);
});

async function uploadPost(form) {
  const formData = new FormData(form);

  const body = {
    title: formData.get("title"),
    body: formData.get("caption"),
    media: {
      url: formData.get("img-url"),
      alt: formData.get("img-alt"),
    },
  };

  const submitBtn = createForm.getElementById("submit-btn");
  submitBtn.disabled = true;

  try {
    await post("/social/posts", body);
    showMessage("Upload was successful!");
    setTimeout(() => {
      window.location.href = "../../feed.html";
    }, 1000);
  } catch (error) {
    showError(error?.message || "Upload failed");
  } finally {
    submitBtn.disabled = false;
  }
}
