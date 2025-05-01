// Defines an array of checkbox IDs for state persistence
const checkboxIds = [
  "mnich_check",
  "bilapani_check",
  "bilyrytir_check",
  "radous_check",
  "splhac_check",
  "strakakal_check",
];

// Iterates over checkbox IDs to manage their state using localStorage
checkboxIds.forEach((id) => {
  // Gets the checkbox element by ID
  const checkbox = document.getElementById(id);
  // Retrieves the saved state from localStorage
  const saved = localStorage.getItem(id);

  // Sets checkbox to checked if localStorage value is "true"
  if (saved === "true") {
    checkbox.checked = true;
  }

  // Adds event listener to save checkbox state to localStorage on change
  checkbox.addEventListener("change", () => {
    // Saves the checkbox state (true or false) to localStorage
    localStorage.setItem(id, checkbox.checked);
  });
});
