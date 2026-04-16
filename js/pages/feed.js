import { get } from "../services/apiClient.js";
import { showError } from "../services/errors.js";

const filteredPosts = document.getElementById("filtered-posts");
const allPosts = document.getElementById("all-posts");

filteredPosts.addEventListener("click", () =>
  fetchPosts("/social/posts/following"),
);

allPosts.addEventListener("click", () => fetchPosts("/social/posts"));

async function fetchPosts(endpoint) {
  try {
    const data = await get(endpoint);
    renderPosts(data);
  } catch (error) {
    showError(error.message || "Something went wrong");
  }
}

async function renderPosts() {}
