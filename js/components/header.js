import { logoutUser } from "../services/authService.js";

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
        <img src="assets/logo.svg" alt="Sippr logo" width="148" height="58"/>
    </a>
    <i class="fa-solid fa-magnifying-glass" id="search-btn"></i>`;
  } else if (path.includes("profile.html") && user === profile?.name) {
    header.innerHTML = `
    <a href="feed.html">
        <img src="assets/logo.svg" alt="Sippr logo" width="190" height="74"/>
    </a>
    <i class="fa-solid fa-arrow-right-from-bracket" id="logout"></i>`;

    // log out user
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", logoutUser);
    }
  } else {
    header.innerHTML = `
    <a href="feed.html">
        <img src="assets/logo.svg" alt="Sippr logo" width="190" height="74"/>
    </a>`;
  }
}
