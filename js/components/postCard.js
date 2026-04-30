const path = window.location.pathname;
const params = new URLSearchParams(window.location.search);
const userProfile = params.get("user");

export function createPostCard(post, options = {}) {
  const { clickable = true } = options;

  const postWrapper = document.createElement("div");
  postWrapper.classList.add("post");

  if (clickable) {
    postWrapper.addEventListener("click", () => {
      window.location.href = `single-post.html?id=${post.id}`;
    });
  }

  const linkUser = document.createElement("a");
  linkUser.href = `profile.html?user=${post.author.name}`;

  linkUser.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  const username = document.createElement("h3");
  username.textContent = post.author.name;
  username.classList.add("username");
  linkUser.appendChild(username);

  const title = document.createElement("h2");
  title.textContent = post.title;

  const caption = document.createElement("p");
  caption.textContent = post.body || "";

  postWrapper.appendChild(linkUser);
  if (post.media?.url) {
    const media = document.createElement("img");
    media.src = post.media.url;
    media.alt = post.media.alt || "";
    media.classList.add("post-img");
    postWrapper.appendChild(media);
  }
  postWrapper.appendChild(title);
  postWrapper.appendChild(caption);

  if (path.includes("single-post.html")) {
    const date = document.createElement("p");
    date.textContent = post.created.slice(0, 10);
    date.classList.add("date");
    postWrapper.appendChild(date);
  }

  if (userProfile === post.author.name && path.includes("profile-post.html")) {
    linkUser.remove();
  }

  return postWrapper;
}
