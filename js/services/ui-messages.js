export function showMessage(message, timeout = 8000) {
  const feedback = document.createElement("div");
  feedback.classList.add("success");

  feedback.textContent = message;
  document.body.prepend(feedback);

  setTimeout(() => {
    feedback.remove();
  }, timeout);
}
