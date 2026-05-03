const basePath = window.location.hostname.includes("github.io")
  ? "/sippr-app"
  : "";

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
    <a href="${basePath}/create-post.html"><i class="fa-solid fa-plus"></i></a>
    <a href="${basePath}/feed.html">
      <img
        src="${basePath}/assets/juice_circle.svg"
        alt="keep scrolling with this juice box"
        class="juice-icon"
        height="110"
        width="110"
      />
    </a>
    <a href="${basePath}/profile.html?user=${username}"><i class="fa-solid fa-user"></i></a>`;
}
