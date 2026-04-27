import { get } from "../services/apiClient.js";
import { put } from "../services/apiClient.js";
import { showError } from "../services/errors.js";
import { createPostCard } from "../components/postCard.js";
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footerNav.js";

const params = new URLSearchParams(window.location.search);
const loggedInUser = JSON.parse(localStorage.getItem("profile"))?.name;
const userProfile = params.get("user");

// fetch profile and posts

async function fetchUserInfo() {
  try {
    const data = await get(`/social/profiles/${userProfile}?_following=true`);
    const profile = data.data;

    const following = await fetchFollowingList();
    renderProfileHeader(profile, following);
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
      `/social/profiles/${userProfile}/posts?page=${page}&limit=${PAGE_LIMIT}&sort=created&sortOrder=desc&_author=true`,
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

function renderProfileHeader(profile, following) {
  const profileHeader = document.getElementById("profile-header");

  profileHeader.innerHTML = "";

  const avatar = document.createElement("img");
  avatar.src =
    profile.avatar?.url ||
    "https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433_1280.png";
  avatar.alt = "profile picture";

  const username = document.createElement("h1");
  username.textContent = profile.name;

  const bio = document.createElement("p");
  bio.textContent = profile.bio;

  const stats = document.createElement("div");
  stats.classList.add("following");

  const followers = document.createElement("p");
  followers.textContent = `Followers: ${profile._count.followers}`;

  const follows = document.createElement("p");
  follows.textContent = `Following: ${profile._count.following}`;

  stats.appendChild(followers);
  stats.appendChild(follows);

  profileHeader.appendChild(avatar);
  profileHeader.appendChild(username);
  profileHeader.appendChild(bio);
  profileHeader.appendChild(stats);

  if (loggedInUser !== userProfile) {
    const followBtn = document.createElement("button");
    followBtn.classList.add("follow-btn");
    profileHeader.appendChild(followBtn);
    followHandling(following, followBtn);
  }
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

// follow/unfollow

async function fetchFollowingList() {
  const data = await get(`/social/profiles/${loggedInUser}?_following=true`);
  const following = data.data.following?.map((user) => user.name) || [];

  return following;
}

function followHandling(following, followBtn) {
  if (!followBtn) return;

  const isFollowing = following.includes(userProfile);
  followBtn.textContent = isFollowing ? "Following" : "Follow";

  followBtn.onclick = async () => {
    followBtn.disabled = true;
    try {
      if (isFollowing) {
        await put(`/social/profiles/${userProfile}/unfollow`);
      } else {
        await put(`/social/profiles/${userProfile}/follow`);
      }
      await fetchFollowingList();
    } catch (error) {
      showError(error.message || "Failed to update following.");
    } finally {
      followBtn.disabled = false;
    }
  };
}

// run code

function initComponents() {
  renderHeader();
  renderFooter();
}

async function initProfilePage() {
  await fetchUserInfo();
  await fetchFollowingList();
  await fetchUserPosts();
}

document.addEventListener("DOMContentLoaded", async () => {
  initComponents();
  await initProfilePage();
});
