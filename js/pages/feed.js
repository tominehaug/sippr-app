import { get } from "../services/apiClient.js";
import { showError } from "../services/errors.js";

const DEFAULT_ENDPOINT = "/social/posts/following";

const filteredPosts = document.getElementById("filtered-posts");
const allPosts = document.getElementById("all-posts");

async function fetchPosts(endpoint) {
  try {
    const data = await get(endpoint);
    renderPosts(data);
  } catch (error) {
    showError(error.message || "Something went wrong");
  }
}

async function renderPosts(posts) {
  const container = document.getElementById("posts-feed");
  container.innerHTML = "";
  posts.forEach((post) => {
    const postWrapper = document.createElement("div");
    postWrapper.classList.add("post");

    postWrapper.addEventListener("click", () => {
      window.location.href = `post.html?id=${post.id}`;
    });

    const linkUser = document.createElement("a");
    linkUser.href = `profile.html?user=${post.author}`;
    linkUser.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    const username = document.createElement("h3");
    username.textContent = post.author;

    linkUser.appendChild(username);

    const media = document.createElement("img");
    media.src = post.media?.url || "";
    media.alt = post.media?.alt || "";

    const title = document.createElement("h2");
    title.textContent = post.title;

    const caption = document.createElement("p");
    caption.textContent = post.body || "";

    postWrapper.appendChild(linkUser);
    postWrapper.appendChild(media);
    postWrapper.appendChild(title);
    postWrapper.appendChild(caption);

    container.appendChild(postWrapper);
  });
}

function activeButton(activeButton) {
  filteredPosts.classList.remove("selected");
  allPosts.classList.remove("selected");

  activeButton.classList.add("selected");
}

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
