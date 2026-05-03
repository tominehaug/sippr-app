import { post } from "./apiClient.js";

const LOGIN_ENDPOINT = "/auth/login";
const basePath = window.location.hostname.includes("github.io")
  ? "/sippr-app"
  : "";

/**
 * Stores access token and in localStorage
 * @param {Object} credentials
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @returns {Promise<object|undefined>} if login is successful, profile object is returned.
 * @example
 * 
 js
 * const profile = await loginUser({
 *   email: "user@exampled.com",
 *   password: "password"
 * });
 * // expected result: 
 * {
 *   name: "example123",
 *   email: "user@exampled.com",
 *   bio: "profile bio",
 *   avatar: {
 *     url: "avatar.jpg",
 *     alt: "Profile picture"
 *   },
 *  ...
 * }
 */

export async function loginUser(credentials) {
  const response = await post(LOGIN_ENDPOINT, credentials);
  const { accessToken, ...profile } = response.data;

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("profile", JSON.stringify(profile));
    return profile;
  }
}

export function logoutUser() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("profile");

  window.location.href = `${basePath}/index.html`;
}
