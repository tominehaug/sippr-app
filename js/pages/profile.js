import { get } from "../services/apiClient.js";
import { showError } from "../services/errors.js";
import { createPostCard } from "../components/postCard.js";
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footerNav.js";
import { logoutUser } from "../services/authService.js";

const params = new URLSearchParams(window.location.search);
const user =
  params.get("user") || JSON.parse(localStorage.getItem("profile"))?.name;

// fetch profile and posts

async function fetchUserInfo() {
  try {
    const data = await get(`/social/profiles/${user}`);
    const profile = data.data;

    renderProfileHeader(profile);
  } catch (error) {
    showError(
      error.message || "Something went wrong when fetching the user info.",
    );
  }
}

const PAGE_LIMIT = 10;

let currentPage = 1;
let isFetching = false;
let isLastPage = false;

async function fetchUserPosts(page = 1) {
  if (isFetching || isLastPage) return;
  try {
    isFetching = true;
    const data = await get(
      `/social/profiles/${user}/posts?page=${page}&limit=${PAGE_LIMIT}&sort=created&sortOrder=desc`,
    );
    const posts = data.data;
    renderProfilePosts(posts, page);

    currentPage = data.meta.currentPage;
    isLastPage = data.meta.isLastPage;
  } catch (error) {
    showError(error.message || "Something went wrong when fetching the posts.");
  } finally {
    isFetching = false;
  }
}

// display profile

function renderProfileHeader(profile) {
  const profileHeader = document.getElementById("profile-header");

  const avatar = document.createElement("img");
  avatar.src = profile.avatar.url;
  avatar.alt = "profile picture";

  const username = document.createElement("h1");
  username.textContent = profile.name;

  const bio = document.createElement("p");
  bio.textContent = profile.bio;

  const following = document.createElement("div");
  following.innerHTML = `<div><p>Followers</p><p class="follow-count"></p></div><div><p>Following</p><p class="follower-count"></p></div>`;
  following.classList.add("following");

  const followerCount = document.getElementsByClassName("follow-count");
  followerCount.textContent = profile._count.followers;

  const followingCount = document.getElementsByClassName("follower-count");
  followingCount.textContent = profile._count.following;

  profileHeader.appendChild(avatar);
  profileHeader.appendChild(username);
  profileHeader.appendChild(bio);
  profileHeader.appendChild(following);
}

function renderProfilePosts(posts, page) {
  const container = document.getElementById("user-posts");
  if (page === 1) {
    container.innerHTML = "";
  }
  posts.forEach((post) => {
    const postCard = createPostCard(post);
    container.appendChild(postCard);
  });
}

// pagination; fetching with scroll event

window.addEventListener("scroll", () => {
  const nearBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

  if (nearBottom) {
    fetchUserPosts(currentPage + 1);
  }
});

// run code

function initComponents() {
  renderHeader();
  renderFooter();
}

async function initProfilePage() {
  await fetchUserInfo();
  await fetchUserPosts();
}

document.addEventListener("DOMContentLoaded", async () => {
  initComponents();
  await initProfilePage();
});

// log out user

const logOut = document.getElementById("logout");
logOut.addEventListener("click", logoutUser);
