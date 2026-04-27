export function renderFooter() {
  const footer = document.querySelector("footer");
  if (!footer) {
    console.error("Footer element not found");
    return;
  }

  const profile = JSON.parse(localStorage.getItem("profile"));
  if (!profile) {
    console.error("Profile not found in localStorage");
    return;
  }

  const username = profile.name;

  footer.innerHTML = `
    <a href="create-post.html"><i class="fa-solid fa-plus"></i></a>
    <a href="feed.html">
      <img
        src="assets/juice_circle.svg"
        alt="keep scrolling with this juice box"
        class="juice-icon"
        height="110"
        width="110"
      />
    </a>
    <a href="profile.html?user=${username}"><i class="fa-solid fa-user"></i></a>`;
}
