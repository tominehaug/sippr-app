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

  return postWrapper;
}
