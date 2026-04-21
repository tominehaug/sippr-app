import { put, del } from "../services/apiClient.js";
import { showError } from "../services/errors.js";
import { showMessage } from "../services/ui-messages.js";
import { validateForm } from "../utils/validation.js";

const editForm = document.getElementById("create-form");
const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

async function fetchPost() {
  try {
    const data = await get(`/social/posts/${postId}`);
    const post = data.data;
    renderEditForm(post);
  } catch (error) {
    showError(error.message || "Something went wrong when fetching the post.");
  }
}

async function renderEditForm(post) {
  document.getElementById("img-url").value = post.media.url || "";
  document.getElementById("img-url").value = post.media.alt || "";
  document.getElementById("title").value = post.title || "";
  document.getElementById("caption").value = post.body || "";
}

editForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const isValid = validateForm(editForm);

  if (!isValid) return;

  await updatePost(editForm);
});

async function updatePost(form) {
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
    await put(`/social/posts/${postId}`, body);
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

// delete post

const deleteBtn = document.getElementById("delete-btn");
if (deleteBtn) {
  deleteBtn.addEventListener("click", confirmAction);
}

function confirmAction() {
  const alertDiv = document.createElement("div");

  const alertTxt = document.createElement("p");
  alertTxt.textContent = "Are you sure you want to delete this post?";

  const confirmBtn = document.createElement("button");
  confirmBtn.textContent = "Yes";

  const returnBtn = document.createElement("button");
  returnBtn.textContent = "No";

  alertDiv.appendChild(alertTxt);
  alertDiv.appendChild(confirmBtn);
  alertDiv.appendChild(returnBtn);

  confirmBtn.addEventListener("click", async () => {
    confirmBtn.disabled = true;

    try {
      await deletePost();
      alertDiv.remove();
      showMessage("Post is deleted.");
      setTimeout(() => {
        window.location.href = "../../feed.html";
      }, 1000);
    } catch (error) {
      console.log(error);
    } finally {
      deleteBtn.disabled = false;
      confirmBtn.disabled = false;
    }
  });

  returnBtn.addEventListener("click", () => {
    alertDiv.remove();
    deleteBtn.disabled = false;
  });
}

async function deletePost() {
  try {
    await del(`/social/posts/${postId}`);
  } catch (error) {
    showError(error.message || "Could not delete post. Try again later.");
    throw error;
  }
}

// init

document.addEventListener("DOMContentLoaded", fetchPost);
