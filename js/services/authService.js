import { post } from "./apiClient.js";
import { showError } from "./errors.js";

const LOGIN_ENDPOINT = "/auth/login";

export async function loginUser(credentials) {
  try {
    const response = await post(LOGIN_ENDPOINT, credentials);
    const { accessToken, ...profile } = response.data;

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("profile", JSON.stringify(profile));
      return profile;
    } else {
      throw new Error("Login successful, but no access token received.");
    }
  } catch (error) {
    showError(error.message || "Login failed");
    throw error;
  }
}

export function logoutUser() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("profile");
}
