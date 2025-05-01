import { preloadAssets } from "./Cache.js";
import {
  animate,
  press,
  spring,
  hover,
} from "https://cdn.jsdelivr.net/npm/motion@12.9.2/+esm";

// Animates a map marker with hover and press interactions
export function AnimateMarker(markerElement, castlecell, url, id, onPress) {
  // Handle hover: Add glow effect and scale castle cell
  hover(markerElement, (element) => {
    animate(
      element,
      {
        filter: [
          "drop-shadow(0 0 0px var(--text))",
          "drop-shadow(0 0 6px var(--text))",
        ],
      },
      { duration: 0.2, easing: "easeInOut" }
    );
    if (castlecell) {
      animate(
        castlecell,
        { scale: [1, 1.05], opacity: [1, 1] },
        { duration: 0.1, easing: "easeIn" }
      );
      if (id) {
        preloadAssets(id); // Preload assets for the cell
      }
    }
    // On hover end: Remove glow and reset scale
    return () => {
      animate(
        element,
        {
          filter: [
            "drop-shadow(0 0 6px var(--text))",
            "drop-shadow(0 0 0px transparent)",
          ],
        },
        { duration: 0.2 }
      );
      if (castlecell) {
        animate(
          castlecell,
          { scale: [1.05, 1], opacity: [1, 1] },
          { duration: 0.1, easing: "easeOut" }
        );
      }
    };
  });

  // Handle press: Add stronger glow and trigger callback or navigation
  press(markerElement, (element) => {
    console.log("Animate.js: marker press start");
    animate(
      element,
      {
        filter: [
          "drop-shadow(0 0 6px var(--text))",
          "drop-shadow(0 0 24px var(--text))",
        ],
      },
      { duration: 0.3, easing: "easeIn" }
    );

    // On press end: Reset glow and execute action
    return (endEvent, info) => {
      animate(
        element,
        {
          filter: [
            "drop-shadow(0 0 24px var(--text))",
            "drop-shadow(0 0 6px var(--text))",
          ],
        },
        { duration: 0.3, easing: "easeOut" }
      );
      if (info.success) {
        console.log("Animate.js: marker press success");
        if (onPress) {
          console.log("Animate.js: calling onPress callback");
          onPress(element, info); // Call custom callback if provided
        } else if (url) {
          console.log("Animate.js: navigating to", url);
          window.location.href = url; // Navigate to URL if no callback
        } else {
          console.log(
            "Animate.js: no URL or onPress provided, skipping action"
          );
        }
      } else {
        console.log("Animate.js: marker press failed, info =", info);
      }
    };
  });
}

// Animates a cell with hover and press interactions
export function AnimateCell(
  cell,
  castlecell,
  charactercell,
  markerElement,
  id,
  url
) {
  let isPressing = false; // Track cell press state
  let isCheckboxPressing = false; // Track checkbox press state

  // Handle hover: Scale cell and add marker glow
  hover(cell, (element, startEvent) => {
    if (!isPressing) {
      animate(
        element,
        { scale: [1, 1.05], opacity: [1, 1] },
        { duration: 0.1, easing: "easeIn" }
      );
      if (cell === castlecell && markerElement) {
        animate(
          markerElement,
          {
            filter: [
              "drop-shadow(0 0 0px var(--text))",
              "drop-shadow(0 0 6px var(--text))",
            ],
          },
          { duration: 0.2, easing: "easeInOut" }
        );
      }
      if (id) {
        preloadAssets(id); // Preload assets for the cell
      }
    }
    // On hover end: Reset scale and marker glow
    return () => {
      if (!isPressing) {
        animate(
          element,
          { scale: [1.05, 1], opacity: [1, 1] },
          { duration: 0.1, easing: "easeOut" }
        );
        if (cell === castlecell && markerElement) {
          animate(
            markerElement,
            {
              filter: [
                "drop-shadow(0 0 6px var(--text))",
                "drop-shadow(0 0 0px transparent)",
              ],
            },
            { duration: 0.2 }
          );
        }
      }
    };
  });

  // Handle press: Scale cell or checkbox and navigate if applicable
  press(cell, (element, event) => {
    if (
      element === charactercell &&
      event.target.matches('input[type="checkbox"]')
    ) {
      isCheckboxPressing = true;
      const checkbox = event.target;
      animate(checkbox, { scale: 0.75 }, { type: spring });
      // On press end: Reset checkbox scale
      return () => {
        animate(checkbox, { scale: 1 }, { duration: 0.1, easing: "easeOut" });
        setTimeout(() => {
          isCheckboxPressing = false;
        }, 100);
      };
    } else {
      isPressing = true;
      animate(element, { scale: 0.95 }, { type: spring });
      // On press end: Reset scale and navigate if applicable
      return (endEvent, info) => {
        animate(element, { scale: 1 }, { duration: 0.1, easing: "easeOut" });
        setTimeout(() => {
          isPressing = false;
        }, 100);
        if (info.success && cell === castlecell) {
          window.location.href = url; // Navigate to castle URL
        } else if (info.success && cell === charactercell) {
          window.location.href = url + "index.html?loadCharacter=true"; // Navigate to character page
        }
      };
    }
  });
}
