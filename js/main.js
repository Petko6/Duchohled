import { initMap, initFooterMap } from "./systems/Map.js";
import { createMarker } from "./components/marker.js";
import { loadBackground } from "./systems/LoadBackground.js";
import { AnimateMarker, AnimateCell } from "./systems/Animate.js";

// Check if the device is mobile by detecting screen width (<1000px)

const isMobile = window.innerWidth < 1000;

// Define an array of castles with details for map markers and list items
const castles = [
  {
    name: "Houska",
    coords: [50.485, 14.653], // Coordinates for Houska Castle
    icon: "./media/erby/houska.svg", // Icon for the marker
    url: "./houska/", // URL to navigate to
    divId: "houska", // ID of the castle's list item
    characterId: "mnich", // ID of the associated character
  },
  {
    name: "Loket",
    coords: [50.185, 12.751],
    icon: "./media/erby/loket.svg",
    url: "./loket/",
    divId: "loket",
    characterId: "strakakal",
  },
  {
    name: "Rožmberk",
    coords: [48.615, 14.372],
    icon: "./media/erby/rozmberk.svg",
    url: "./rozmberk/",
    divId: "rozmberk",
    characterId: "bilapani",
  },
  {
    name: "Radyně",
    coords: [49.663, 13.432],
    icon: "./media/erby/radyne.svg",
    url: "./radyne/",
    divId: "radyne",
    characterId: "radous",
  },
  {
    name: "Vrškamýk",
    coords: [49.651, 14.093],
    icon: "./media/erby/vrskamyk.svg",
    url: "./vrskamyk/",
    divId: "vrskamyk",
    characterId: "bilyrytir",
  },
  {
    name: "Kašperk",
    coords: [49.171, 13.563],
    icon: "./media/erby/kasperk.svg",
    url: "./kasperk/",
    divId: "kasperk",
    characterId: "splhac",
  },
];

// Run code after the webpage is fully loaded
document.addEventListener("DOMContentLoaded", async function () {
  let map;
  let footermap;

  let footerMarker;
  // Initialize the main map only on non-mobile devices
  if (!isMobile) {
    // Init map on element #map
    map = await initMap("map", false, castles);
  }

  footermap = await initFooterMap("footermap");

  footerMarker = await createMarker(
    footermap,
    "./media/svg/logo.svg",
    [50.0907895, 14.4021669],
    {
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      className: "duchohled-marker",
    }
  );

  castles.forEach(async function (castle) {
    let marker;
    let markerElement;
    // Get the DOM elements for the castle and character list items
    const castlecell = document.getElementById(castle.divId);
    const charactercell = document.getElementById(castle.characterId);

    if (!isMobile && map) {
      marker = await createMarker(map, castle.icon, castle.coords, {
        className: `pin-${castle.divId}`,
      });

      // Animations and listeners
      markerElement = marker?.getElement();

      AnimateMarker(markerElement, castlecell, castle.url);
    }

    // Load background for castlecell
    loadBackground(
      castlecell,
      `./media/hrady/${castle.divId}.webp`,
      "./media/fallback.webp",
      castle.divId
    );

    // Load background for charactercell
    loadBackground(
      charactercell,
      `./media/ilustrace/${castle.characterId}.webp`,
      "./media/fallback.webp",
      castle.characterId
    );

    // Create an array of cells
    const cells = [castlecell, charactercell];

    // Inside the castles.forEach loop, modify the cells.forEach section
    cells.forEach((cell) => {
      AnimateCell(
        cell,
        castlecell,
        charactercell,
        markerElement,
        castle.divId,
        castle.url
      );

      // Remove highlight effect on mobile devices when touch ends
      if (isMobile) {
        cell.addEventListener("touchend", () => {
          setTimeout(() => {
            isPressing = false; // Reset cell press flag
            isCheckboxPressing = false; // Reset checkbox press flag
          }, 100);
        });
      }
    });
  });
});
