/* Selects key DOM elements for canvas, info bar, buttons, and text content */
/* Container for canvas elements */
const canvascontainer = document.getElementById("canvascontainer");
/* Castle and legend information section */
const infobar = document.getElementById("infobar");
/* Button to toggle views */
const nextbutton = document.getElementById("nextbutton");
/* Button to toggle fullscreen mode */
const fullscreenbutton = document.getElementById("fullscreenbutton");
/* Legend text section */
const characterParagraph = document.getElementById("character-paragraph");
/* Selects all elements with the class 'button' */
const buttons = document.querySelectorAll(".button");
/* Container for Three.js */
const threecontainer = document.getElementById("threecontainer");
/* Container for image content */
const imagecontainer = document.getElementById("imagecontainer");

/* Adds touchend event listener to all buttons to reset transform scale */
buttons.forEach((button) => {
  button.addEventListener("touchend", () => {
    /* Resets button scale to 1 on touch end */
    button.style.transform = "scale(1)";
  });
});

/* Toggles fullscreen mode for the canvas and info bar */
function toggleFullscreen() {
  /* Ensures smooth animations */
  requestAnimationFrame(() => {
    /* Expands/collapses canvas to full screen */
    canvascontainer.classList.toggle("fullscreen");
    /* Shows/hides info bar */
    infobar.classList.toggle("hideinfobar");
    /* Conditional for larger screens */
    if (window.innerWidth > 1250) {
      /* Hides/shows next button */
      nextbutton.classList.toggle("hidebutton");
    }
    /* Updates fullscreen button state */
    fullscreenbutton.classList.toggle("fullscreen-active");
  });
}

/* Toggles between 3D and image views */
function toggleView() {
  /* Ensures smooth animations */
  requestAnimationFrame(() => {
    /* Slides 3D container (left/right) */
    threecontainer.classList.toggle("move");
    /* Slides image container */
    imagecontainer.classList.toggle("move");
    /* Conditional for larger screens */
    if (window.innerWidth > 1250) {
      /* Hides/shows fullscreen button */
      fullscreenbutton.classList.toggle("hidebutton");
    }
    /* Rotates next button (for visual feedback) */
    nextbutton.classList.toggle("flip");

    /* Scrolls to relevant content based on view */
    if (threecontainer.classList.contains("move")) {
      /* Scrolls to character text when Image view is active */
      characterParagraph.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      /* Scrolls info bar to top when 3D view is active */
      infobar.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  });
}
