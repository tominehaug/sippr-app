import { get } from "../services/apiClient.js";
import { showError } from "../services/errors.js";
import { createPostCard } from "../components/postCard.js";

// fetch posts

const DEFAULT_ENDPOINT = "/social/posts/following";

const filteredPosts = document.getElementById("filtered-posts");
const allPosts = document.getElementById("all-posts");

async function fetchPosts(endpoint) {
  try {
    const data = await get(endpoint);
    const posts = data.data;
    renderPosts(posts);
  } catch (error) {
    showError(error.message || "Something went wrong");
  }
}

// display posts

async function renderPosts(posts) {
  const container = document.getElementById("posts-feed");
  container.innerHTML = "";
  posts.forEach((post) => {
    const postCard = createPostCard(post);
    container.appendChild(postCard);
  });
}

// UI handling

function activeButton(activeButton) {
  filteredPosts.classList.remove("selected");
  allPosts.classList.remove("selected");
  activeButton.classList.add("selected");
}

// run code

async function initFeed() {
  activeButton(filteredPosts);
  await fetchPosts(DEFAULT_ENDPOINT);
}

document.addEventListener("DOMContentLoaded", initFeed);

filteredPosts.addEventListener("click", async () => {
  activeButton(filteredPosts);
  fetchPosts(DEFAULT_ENDPOINT);
});

allPosts.addEventListener("click", async () => {
  activeButton(allPosts);
  fetchPosts("/social/posts");
});

// search logic
