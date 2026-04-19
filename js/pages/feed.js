import { get } from "../services/apiClient.js";
import { showError } from "../services/errors.js";
import { createPostCard } from "../components/postCard.js";
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footerNav.js";

const DEFAULT_ENDPOINT = "/social/posts/following";
let currentEndpoint = DEFAULT_ENDPOINT;
const PAGE_LIMIT = 10;

const filteredPosts = document.getElementById("filtered-posts");
const allPosts = document.getElementById("all-posts");

// fetch posts

let currentPage = 1;
let isFetching = false;
let isLastPage = false;

async function fetchPosts(endpoint, page = 1) {
  if (isFetching || isLastPage) return;
  try {
    isFetching = true;
    const data = await get(
      `${endpoint}?page=${page}&limit=${PAGE_LIMIT}&sort=created&sortOrder=desc&_author=true`,
    );
    const posts = data.data;
    renderPosts(posts, page);

    currentPage = data.meta.currentPage;
    isLastPage = data.meta.isLastPage;
    currentEndpoint = endpoint;
  } catch (error) {
    showError(error.message || "Something went wrong");
  } finally {
    isFetching = false;
  }
}

// load and display posts

async function renderPosts(posts, page) {
  const container = document.getElementById("posts-feed");
  if (page === 1) {
    container.innerHTML = "";
  }
  posts.forEach((post) => {
    const postCard = createPostCard(post);
    container.appendChild(postCard);
  });
}

window.addEventListener("scroll", () => {
  const nearBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

  if (nearBottom) {
    fetchPosts(currentEndpoint, currentPage + 1);
  }
});

// UI handling

function activeButton(activeButton) {
  filteredPosts.classList.remove("selected");
  allPosts.classList.remove("selected");
  activeButton.classList.add("selected");
}

// run code

async function initFeed() {
  activeButton(filteredPosts);
  await fetchPosts(DEFAULT_ENDPOINT, 1);
}

document.addEventListener("DOMContentLoaded", () => {
  initFeed();
  renderHeader();
  renderFooter();
});

filteredPosts.addEventListener("click", async () => {
  currentPage = 1;
  isLastPage = false;

  activeButton(filteredPosts);
  fetchPosts(DEFAULT_ENDPOINT, 1);
});

allPosts.addEventListener("click", async () => {
  currentPage = 1;
  isLastPage = false;

  activeButton(allPosts);
  fetchPosts("/social/posts", 1);
});

// search logic
