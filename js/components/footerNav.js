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
      <img
        src="assets/juice_circle.svg"
        alt="keep scrolling with this juice box"
        class="juice-icon"
        height="46"
        width="46"
      />
    <a href="profile.html?user=${username}"><i class="fa-solid fa-user"></i></a>`;
}
