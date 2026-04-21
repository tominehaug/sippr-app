import { put, del } from "../services/apiClient.js";
import { showError } from "../services/errors.js";
import { showMessage } from "../services/ui-messages.js";
import { validateForm } from "../utils/validation.js";

const editForm = document.getElementById("create-form");
const params = new URLSearchParams(window.location.search);
const postId = params.get("id");
let body = {};

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

  body = {
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

deleteBtn.addEventListener("click", deletePost);

function deletePost(){
    //alert and ask to confirm choice
    try {
        await del(`/social/posts/${postId}`, body)
    } catch (error) {
        showError(error.message || "Could not delete post. Try again later.")
    }
}