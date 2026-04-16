export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function showError(message, timeout = 3000) {
  const error = document.createElement("div");
  error.classList.add("error");

  error.textContent = message;
  document.body.prepend(error);

  setTimeout(() => {
    error.remove();
  }, timeout);
}
