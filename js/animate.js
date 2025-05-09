// Import Motion One library for animations
import {
  animate,
  stagger,
  inView,
  press,
  spring,
  hover,
} from "https://cdn.jsdelivr.net/npm/motion@12.9.2/+esm";

const isMobile = window.innerWidth < 1000;

// Fade-left animation for .hamburger and .desktop elements
const fadeLeftSelectors = [".hamburger", ".desktop"];
fadeLeftSelectors.forEach((selector) => {
  inView(
    "header",
    () => {
      // Animate elements from right (x: 100) to original position (x: 0) with fade-in
      animate(
        selector,
        { opacity: [0, 1], x: [100, 0] },
        {
          duration: 0.5,
          easing: [0.17, 0.55, 0.55, 1],
        }
      );
      // Reverse animation when element leaves viewport
      return () => animate(selector, { opacity: 0, x: 100 }, { duration: 0.5 });
    },
    { threshold: 0.1 }
  ); // Trigger when 10% of element is visible
});

// Fade-right animation for #logo
inView(
  "header",
  () => {
    // Animate logo from left (x: -100) to original position (x: 0) with fade-in
    animate(
      "#logo",
      { opacity: [0, 1], x: [-100, 0] },
      {
        duration: 0.5,
        easing: [0.17, 0.55, 0.55, 1],
      }
    );
    // Reverse animation when logo leaves viewport
    return () => animate("#logo", { opacity: 0, x: -100 }, { duration: 0.5 });
  },
  { threshold: 0.1 }
); // Trigger when 10% of logo is visible

// Zoom-in animation for .home-main h1, .home-main .main-button, and nav .main-button
const zoomInSelector = [
  ".home-main h1",
  ".home-main .main-button",
  "nav .main-button",
];
zoomInSelector.forEach((selector) => {
  inView(
    selector,
    () => {
      // Animate elements from smaller scale (0.8) to normal (1) with fade-in
      animate(
        selector,
        { opacity: [0, 1], scale: [0.8, 1] },
        {
          duration: 0.3,
          easing: [0.17, 0.55, 0.55, 1],
        }
      );
      // Reverse animation when elements leave viewport
      return () =>
        animate(selector, { opacity: 0, scale: 0.8 }, { duration: 0.5 });
    },
    { threshold: 0.1 }
  ); // Trigger when 10% of element is visible
});

// Fade-in animation for .fullscreenbutton (after other animations, no movement)
inView(
  ".fullscreenbutton",
  () => {
    // Animate button with fade-in only (no transform)
    animate(
      ".fullscreenbutton",
      { opacity: [0, 1] },
      {
        duration: 1,
        easing: [0.17, 0.55, 0.55, 1],
        delay: 0.25, // Delay to start after other animations
      }
    );
    // Reverse animation when button leaves viewport
    return () =>
      animate(".fullscreenbutton", { opacity: 0 }, { duration: 0.5 });
  },
  { threshold: 0.1 }
); // Trigger when 10% of button is visible

// Fade-up animation for .castlerow .cell elements
inView(
  ".castlerow",
  () => {
    // Animate cells from below (y: 50) to original position (y: 0) with fade-in
    animate(
      ".castlerow .cell",
      {
        opacity: [0, 1],
        y: [50, 0],
      },
      {
        duration: 0.25,
        easing: "ease-in",
        delay: stagger(0.025), // Staggered delay for sequential animation
      }
    );
    // Reverse animation when cells leave viewport
    return () =>
      animate(
        ".castlerow .cell",
        {
          opacity: 0,
          y: 50,
        },
        {
          duration: 0.5,
          easing: "ease-out",
        }
      );
  },
  { threshold: 0.1 }
); // Trigger when 50% of cell is visible

inView(
  ".lore-container",
  () => {
    animate(
      ".lore-container p",
      {
        opacity: [0, 1],
        x: [-200, 0],
      },
      {
        duration: 0.5,
        easing: "ease-in",
        delay: stagger(0.05), // Staggered delay for sequential animation
      }
    );
    return () =>
      animate(
        ".lore-container p",
        {
          opacity: 0,
          x: -200,
        },
        {
          duration: 0.5,
          easing: "ease-out",
        }
      );
  },
  { threshold: 0.1 }
);

animate(
  ".infobar > *",
  {
    opacity: [0, 1],
    x: [-200, 0],
  },
  {
    duration: 0.5,
    easing: "ease-in",
  }
);

press(
  'input[type="text"], input[type="email"], input[type="tel"], textarea, input[type="submit"]',
  (element) => {
    animate(
      element,
      { scale: 0.95 },
      {
        type: spring,
        bounce: 0.3,
        duration: 0.3,
      }
    );
    return () => animate(element, { scale: 1 });
  }
);

hover('input[type="submit"]', (element) => {
  animate(element, { scale: 1.05 });
  return () => {
    animate(element, { scale: 1 });
  };
});

// Handle interactions for the tour section
let mainTourElement = document.getElementById("tour");
let tourElements = ["#tour img", "#tour h2"];

if (mainTourElement) {
  console.log("Tour element exists");

  let isPressing = false; // Track if the tour element is being pressed

  // Add hover animation for tour images
  hover("#tour img", (element, startEvent) => {
    // Apply hover effect only if not currently pressing
    if (!isPressing) {
      tourElements.forEach((tourElement) => {
        animate(
          tourElement,
          { scale: [1, 1.05], opacity: [1, 1] },
          { duration: 0.1, easing: "easeIn" }
        );
      });
    }

    // Reset animation on hover end
    return () => {
      if (!isPressing) {
        tourElements.forEach((tourElement) => {
          animate(
            tourElement,
            { scale: [1.05, 1], opacity: [1, 1] },
            { duration: 0.1, easing: "easeOut" }
          );
        });
      }
    };
  });

  // Add press interaction for tour images
  press("#tour img", (element, event) => {
    isPressing = true; // Mark as pressing
    animate(element, { scale: 0.95 }, { type: "spring" });
    return (endEvent, info) => {
      animate(element, { scale: 1 }, { duration: 0.1, easing: "easeOut" });
      setTimeout(() => {
        isPressing = false; // Reset pressing state
      }, 100);
      // Navigate to the tour page if press is successful
      if (info.success) {
        window.location.href = "./tour";
      }
    };
  });

  // Reset pressing state on touch end for mobile devices
  if (isMobile) {
    document.querySelector("#tour img").addEventListener("touchend", () => {
      setTimeout(() => {
        isPressing = false;
      }, 100);
    });
  }
}
