export function renderHeader() {
  const header = document.querySelector("header");

  if (!header) {
    console.error("Header element not found");
    return;
  }

  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const user = params.get("user");
  const profile = JSON.parse(localStorage.getItem("profile"));

  if (path.includes("feed.html")) {
    header.innerHTML = `
    <a href="feed.html">
        <img src="assets/logo.svg" alt="Sippr logo" width="86" height="35"/>
    </a>
    <i class="fa-solid fa-magnifying-glass" id="search-bar"></i>`;
  } else if (path.includes("profile.html") && user === profile.name) {
    header.innerHTML = `
    <a href="feed.html">
        <img src="assets/logo.svg" alt="Sippr logo" width="86" height="35"/>
    </a>
    <i class="fa-solid fa-arrow-right-from-bracket"></i>`;
  } else {
    header.innerHTML = `
    <a href="feed.html">
        <img src="assets/logo.svg" alt="Sippr logo" width="86" height="35"/>
    </a>`;
  }
}
