export function renderHeader() {
  const header = document.querySelector("header");

  if (!header) {
    console.error("Header element not found");
    return;
  }

  const path = window.location.pathname;

  if (path.includes("feed.html")) {
    header.innerHTML = `
    <a href="feed.html">
        <img src="assets/logo.svg" alt="Sippr logo" width="86" height="35"/>
    </a>
    <i class="fa-solid fa-magnifying-glass" id="search-bar"></i>`;
  } else {
    header.innerHTML = `
    <a href="feed.html">
        <img src="assets/logo.svg" alt="Sippr logo" width="86" height="35"/>
    </a>`;
  }
}
