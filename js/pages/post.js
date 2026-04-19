import { createPostCard } from "../components/postCard.js";

async function renderSinglePost(post) {
  const container = document.getElementById("post-container");
  container.innerHTML = "";

  const postCard = createPostCard(post);
  container.appendChild(postCard);
}

document.addEventListener("DOMContentLoaded", renderSinglePost);
