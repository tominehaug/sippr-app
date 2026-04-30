/**
 * Validates all input from any form based on built-in HTML validation.
 * Shows user validation messages.
 * updates CSS class according to validation results.
 * @param {HTMLFormElement} form - The form to be validated.
 * @returns {boolean} stored in variable isValid, saying whether all input passed the validation.
 * @example
 * 
 js
  * const valid = validateForm(form);
  * // expected result: true
  */

export function validateForm(form) {
  let isValid = true;

  const inputs = Array.from(form.querySelectorAll("input"));

  inputs.forEach((input) => {
    const errorDiv = input.nextElementSibling;

    if (!input.checkValidity()) {
      errorDiv.textContent = input.validationMessage;
      input.classList.add("invalid");
      isValid = false;
    } else {
      errorDiv.textContent = "";
      input.classList.remove("invalid");
    }
  });

  return isValid;
}
