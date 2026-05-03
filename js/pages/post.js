import { renderFooter } from "../components/footerNav.js";
import { renderHeader } from "../components/header.js";
import { createPostCard } from "../components/postCard.js";
import { get } from "../services/apiClient.js";

const basePath = window.location.hostname.includes("github.io")
  ? "/sippr-app"
  : "";

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

  const creator = post.author.name;
  const loggedInUser = JSON.parse(localStorage.getItem("profile"))?.name;

  if (creator === loggedInUser) {
    const editLink = document.createElement("a");
    editLink.href = `${basePath}/edit-post.html?id=${id}`;
    const editIcon = document.createElement("i");
    editIcon.classList.add("fa-solid", "fa-share-from-square");
    editLink.appendChild(editIcon);
    container.appendChild(editLink);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  renderHeader();
  renderFooter();
  await fetchSinglePost();
});
