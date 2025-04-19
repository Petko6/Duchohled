/* Selects the hamburger menu button and mobile navigation elements */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobilenav");

/* Toggles the mobile menu and hamburger icon on click */
hamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("active"); /* Shows/hides mobile menu */
  hamburger.classList.toggle("active"); /* Updates hamburger icon state */
});

/* Closes mobile menu when any link inside it is clicked */
mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active"); /* Resets hamburger icon */
    mobileMenu.classList.remove("active"); /* Hides mobile menu */
  });
});