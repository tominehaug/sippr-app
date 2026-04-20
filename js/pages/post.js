import { createPostCard } from "../components/postCard.js";
import { get } from "../services/apiClient.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function fetchSinglePost() {
  try {
    const data = await get(`/social/posts/${id}?_author=true`);
    const post = data.data;

    renderSinglePost(post);
  } catch (error) {
    showError(error.message || "Something went wrong when fetching the post.");
  }
}

async function renderSinglePost(post) {
  const container = document.getElementById("post-container");
  container.innerHTML = "";

  const postCard = createPostCard(post);
  container.appendChild(postCard);
}

document.addEventListener("DOMContentLoaded", fetchSinglePost);
