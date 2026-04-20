import { get } from "../services/apiClient.js";
import { showError } from "../services/errors.js";
import { createPostCard } from "../components/postCard.js";
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footerNav.js";

const DEFAULT_ENDPOINT = "/social/posts/following";
const PAGE_LIMIT = 10;

let currentEndpoint = DEFAULT_ENDPOINT;
let currentPosts = [];

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
    currentPosts = page === 1 ? posts : [...currentPosts, ...posts];
    renderPosts(currentPosts, page);

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

// search logic

function handleSearchClick(e) {
  if (e.target.id === "search-btn") {
    openSearch();
  } else if (!e.target.closest("#searchForm")) {
    closeSearch();
  }
}

function openSearch() {
  const header = document.querySelector("header");

  header.innerHTML = `
  <form id="searchForm">
    <label for="search-input" class="visually-hidden">Search Posts</label>
    <input type="search" name="search-input" id="search-input" placeholder="Search..." />
    <button type="submit"><i class="fa-solid fa-magnifying-glass" id="search-bar"></i></button>
  </form>`;

  const input = document.getElementById("search-input");
  input.focus();

  input.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();
    conveySearch(searchTerm);
  });
}

function conveySearch(searchTerm) {
  const result = currentPosts.filter((post) => {
    return (
      post.title?.toLowerCase().includes(searchTerm) ||
      post.body?.toLowerCase().includes(searchTerm) ||
      post.author?.name?.toLowerCase().includes(searchTerm)
    );
  });
  console.log(result);
  renderPosts(result, 1);
}

function initSearch() {
  document.addEventListener("click", handleSearchClick);
}

function closeSearch() {
  renderHeader();
  renderPosts(currentPosts, 1);
}

// run code

async function initFeed() {
  activeButton(filteredPosts);
  await fetchPosts(DEFAULT_ENDPOINT, 1);
}

document.addEventListener("DOMContentLoaded", async () => {
  renderHeader();
  renderFooter();
  initSearch();
  await initFeed();
});

filteredPosts.addEventListener("click", async () => {
  currentPage = 1;
  isLastPage = false;
  currentEndpoint = DEFAULT_ENDPOINT;

  activeButton(filteredPosts);
  fetchPosts(DEFAULT_ENDPOINT, 1);
});

allPosts.addEventListener("click", async () => {
  currentPage = 1;
  isLastPage = false;
  currentEndpoint = "/social/posts";

  activeButton(allPosts);
  fetchPosts("/social/posts", 1);
});
