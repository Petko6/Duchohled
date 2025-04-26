// Import Motion One library for animations and hover gesture detection
import {
  animate,
  press,
  hover,
  spring
} from "https://cdn.jsdelivr.net/npm/motion@12.9.0/+esm";

// Declare global variables to store the main map and footer map objects
let map;
let footermap;

// Define geographical boundaries for the Czech Republic to limit map panning
const bounds = [
  [48.5, 12.1], // Southwest corner of the Czech Republic
  [51.1, 18.9], // Northeast corner of the Czech Republic
];

// Run code after the webpage is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Check if the device is mobile by detecting screen width (<1000px)
  const isMobile = window.innerWidth < 1000;

  // Initialize the main map only on non-mobile devices
  if (!isMobile) {
    // Create a Leaflet map centered on the Czech Republic with restricted zoom and panning
    map = L.map("map", {
      scrollWheelZoom: false, // Disable zooming with the mouse wheel by default
      wheelDebounceTime: 20, // Delay to smooth out wheel events
      center: [50, 15], // Center the map on the Czech Republic
      zoom: 7, // Set initial zoom level
      maxBounds: bounds, // Limit map movement to the defined boundaries
      maxBoundsViscosity: 0.7, // Add resistance when trying to pan outside boundaries
    });

    // Add a Jawg tile layer to display the map's visual tiles
    L.tileLayer(
      "https://tile.jawg.io/4d82d3b9-0ca1-4b9d-a6d0-c598dd8291c7/{z}/{x}/{y}{r}.png?access-token=Vljwn5szVctkG5hh1b5nR3oHzd3T9mW1gSO66SwVJ53KL70VC4sl3rezA1OpAcqt",
      {
        maxZoom: 10, // Set maximum zoom level
        minZoom: 7, // Set minimum zoom level
      }
    ).addTo(map);
  }

  // Implement custom scroll zoom behavior for the main map on desktop
  if (!isMobile) {
    // Get the map container element and zoom limits
    const container = map.getContainer();
    const minZoom = map.getMinZoom();
    const maxZoom = map.getMaxZoom();

    // Define delays for enabling/disabling scroll zoom
    const ENABLE_DELAY = 20; // Short delay before enabling zoom
    const DISABLE_DELAY = 500; // Longer delay before disabling zoom

    // Track the zoom state: 'idle', 'pendingEnable', 'enabled', or 'pendingDisable'
    let state = "idle";
    let timerId = null;
    let lastDelta = 0;

    // Helper function: Reset to idle state and disable scroll zoom
    function toIdle() {
      clearTimeout(timerId);
      map.scrollWheelZoom.disable();
      state = "idle";
    }

    // Helper function: Schedule a function to run after a specified delay
    function schedule(fn, delay) {
      clearTimeout(timerId);
      timerId = setTimeout(fn, delay);
    }

    // Handle mouse wheel events to dynamically enable/disable scroll zoom
    container.addEventListener(
      "wheel",
      (e) => {
        const delta = e.deltaY; // Detect scroll direction
        const z = map.getZoom(); // Get current zoom level
        const canZoomIn = delta < 0 && z < maxZoom; // Check if zooming in is possible
        const canZoomOut = delta > 0 && z > minZoom; // Check if zooming out is possible
        const actionable = canZoomIn || canZoomOut; // Determine if zoom action is valid

        // Manage state transitions based on zoom conditions
        switch (state) {
          case "idle":
            if (actionable) {
              state = "pendingEnable";
              schedule(() => {
                map.scrollWheelZoom.enable();
                state = "enabled";
              }, ENABLE_DELAY);
              e.preventDefault(); // Prevent the webpage from scrolling
            }
            break;
          case "pendingEnable":
            e.preventDefault(); // Block webpage scrolling during enable delay
            break;
          case "enabled":
            e.preventDefault(); // Block webpage scrolling while zooming
            if ((delta < 0 && z >= maxZoom) || (delta > 0 && z <= minZoom)) {
              state = "pendingDisable";
              schedule(() => toIdle(), DISABLE_DELAY);
            }
            break;
          case "pendingDisable":
            e.preventDefault(); // Block webpage scrolling
            if (delta * lastDelta < 0) {
              // Detect scroll direction change
              clearTimeout(timerId);
              state = "enabled";
            }
            break;
        }

        lastDelta = delta; // Store the last scroll direction
      },
      { passive: false } // Allow preventing default scroll behavior
    );

    // Disable scroll zoom when the mouse leaves the map area
    container.addEventListener("mouseleave", () => {
      toIdle();
    });
  }

  // Initialize the footer map centered on Prague Castle
  footermap = L.map("footermap", {
    center: [50.0907895, 14.4021669], // Coordinates for Prague Castle
    zoom: 17, // Set detailed zoom level
    maxBounds: bounds, // Restrict panning to the Czech Republic
    maxBoundsViscosity: 0.7, // Add resistance when panning outside boundaries
  });

  // Add a Jawg tile layer for the footer map's visual tiles
  L.tileLayer(
    "https://tile.jawg.io/4d82d3b9-0ca1-4b9d-a6d0-c598dd8291c7/{z}/{x}/{y}{r}.png?access-token=Vljwn5szVctkG5hh1b5nR3oHzd3T9mW1gSO66SwVJ53KL70VC4sl3rezA1OpAcqt",
    {
      maxZoom: 20, // Allow high zoom for detailed view
      minZoom: 10, // Set minimum zoom level
    }
  ).addTo(footermap);

  // Create a custom icon for the footer map marker
  const duchohledIcon = L.icon({
    iconUrl: "./media/svg/logo.svg", // Use Duchohled logo as the marker icon
    iconSize: [40, 40], // Set icon size
    iconAnchor: [20, 20], // Center the icon on the marker point
    className: "duchohled-marker", // Add a custom class for styling
  });

  // Add a marker for the address on the footer map
  const footerMarker = L.marker([50.0907895, 14.4021669], {
    icon: duchohledIcon,
  }).addTo(footermap);

  // Define an array of castles with details for map markers and list items
  const castles = [
    {
      name: "Houska",
      coords: [50.485, 14.653], // Coordinates for Houska Castle
      icon: "./media/erby/houska.svg", // Icon for the marker
      url: "./houska", // URL to navigate to
      divId: "houska", // ID of the castle's list item
      characterId: "mnich", // ID of the associated character
    },
    {
      name: "Loket",
      coords: [50.185, 12.751],
      icon: "./media/erby/loket.svg",
      url: "./loket",
      divId: "loket",
      characterId: "strakakal",
    },
    {
      name: "Rožmberk",
      coords: [48.615, 14.372],
      icon: "./media/erby/rozmberk.svg",
      url: "./rozmberk",
      divId: "rozmberk",
      characterId: "bilapani",
    },
    {
      name: "Radyně",
      coords: [49.663, 13.432],
      icon: "./media/erby/radyne.svg",
      url: "./radyne",
      divId: "radyne",
      characterId: "radous",
    },
    {
      name: "Vrškamýk",
      coords: [49.651, 14.093],
      icon: "./media/erby/vrskamyk.svg",
      url: "./vrskamyk",
      divId: "vrskamyk",
      characterId: "bilyrytir",
    },
    {
      name: "Kašperk",
      coords: [49.171, 13.563],
      icon: "./media/erby/kasperk.svg",
      url: "./kasperk",
      divId: "kasperk",
      characterId: "splhac",
    },
  ];

  // Loop through each castle to add markers and handle interactions
  castles.forEach((castle) => {
    // Declare a variable to store the map marker
    let marker;

    // Get the DOM elements for the castle and character list items
    const castlecell = document.getElementById(castle.divId);
    const charactercell = document.getElementById(castle.characterId);

    // Create a marker with a custom icon for the castle on desktop only
    if (!isMobile) {
      const castleIcon = L.icon({
        iconUrl: castle.icon, // Use the castle-specific icon
        iconSize: [32, 32], // Set icon size
        iconAnchor: [16, 32], // Anchor icon to the bottom center
        popupAnchor: [0, -32], // Position for popups above the marker
        className: `pin-${castle.divId}`, // Add a custom class for styling
      });

      // Add the marker to the main map at the castle's coordinates
      marker = L.marker(castle.coords, {
        icon: castleIcon,
      }).addTo(map);
    }

    // Load a WebP background image for the castle list item
    const img = new Image();
    img.src = `./media/hrady/${castle.divId}.webp`;
    img.onload = () => {
      castlecell.style.background = `url('${img.src}') no-repeat top/cover`;
    };
    img.onerror = () => {
      console.error(`Failed to load background for ${castle.divId}`);
      castlecell.style.background =
        "url('./media/fallback.webp') no-repeat top/cover";
    };

    // Preload 3D model and texture files to improve performance
    async function preloadAssets(
      modelName = null,
      exrTextureName = "venice_sunset_1k.exr"
    ) {
      try {
        const cache = await caches.open("model-cache");

        // Preload the 3D model if a model name is provided
        if (modelName) {
          const modelUrl = `../models/${modelName}.glb`;
          const cachedModel = await cache.match(modelUrl);
          if (!cachedModel) {
            const response = await fetch(modelUrl);
            if (!response.ok)
              throw new Error(`Failed to fetch model ${modelName}`);
            await cache.put(modelUrl, response.clone());
          }
        }

        // Preload the EXR texture file
        const exrUrl = `../media/${exrTextureName}`;
        const cachedExr = await cache.match(exrUrl);
        if (!cachedExr) {
          const response = await fetch(exrUrl);
          if (!response.ok)
            throw new Error(`Failed to fetch EXR texture ${exrTextureName}`);
          await cache.put(exrUrl, response.clone());
        }
      } catch (error) {
        console.error(
          `Preload error for ${modelName || exrTextureName}:`,
          error
        );
      }
    }

    // Create an array of marker and list item elements for interaction
    const markerElement = marker?.getElement();
    const footerMarkerElement = footerMarker.getElement();
    const markerElements = [markerElement, footerMarkerElement].filter(Boolean);
    const cells = [castlecell, charactercell];

    // Apply animations to map markers
    markerElements.forEach((marker, index) => {
      hover(marker, (element) => {
        // On hover: Add a glowing effect to the marker and scale the castle list item
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
        if (index === 0) {
          // Only scale castle list item for main map marker
          animate(
            castlecell,
            { scale: [1, 1.05], opacity: [1, 1] },
            { duration: 0.1, easing: "easeIn" }
          );
        }
        preloadAssets(castle.divId);

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
          if (index === 0) {
            animate(
              castlecell,
              { scale: [1.05, 1], opacity: [1, 1] },
              { duration: 0.1, easing: "easeOut" }
            );
          }
        };
      });

      // Handle click events on markers to navigate to a new page
      press(marker, (element) => {
        console.log("markerclick");
        animate(
          element,
          {
            filter: [
              "drop-shadow(0 0 6px var(--text))",
              "drop-shadow(0 0 24px var(--text))",
            ],
          },
          { duration: 0.3, easing: "easeIn" }
        ).then(() => {
          if (index === 0) {
            // Navigate to the castle's page for main map marker
            window.location.href = castle.url;
          } else {
            // Navigate to an external map for footer marker
            window.location.href =
              "https://mapy.cz/zakladni?source=coor&id=14.401989874205015%2C50.09066215820785&x=14.4019899&y=50.0906622&z=17";
          }
        });
      });
    });

    // Apply animations to castle and character list items
    cells.forEach((cell) => {
      hover(cell, (element, startEvent) => {
        // On hover: Scale up the list item
        animate(
          element,
          { scale: [1, 1.05], opacity: [1, 1] },
          { duration: 0.1, easing: "easeIn" }
        );
        if (cell === castlecell && markerElement) {
          // Add glow to the map marker when hovering the castle list item
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
        preloadAssets(castle.divId);

        // On hover end: Reset scale and remove marker glow
        return () => {
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
        };
      });

      // Handle click events on list items to navigate to a new page
      press(cell, (cell, event) => {
        if (cell === charactercell) {
          if (event.target.matches('input[type="checkbox"]')) {
            const checkbox = event.target;
            animate(checkbox, { scale: 0.75 }, { type: spring });
            return () => animate(checkbox, { scale: 1 });
          }
          // Navigate to the character page for the castle
          window.location.href = `${castle.url}/index.html?loadCharacter=true`;
        } else {
          // Navigate to the castle's page
          window.location.href = castle.url;
        }
      });

      // Remove highlight effect on mobile devices when touch ends
      if (isMobile) {
        cell.addEventListener("touchend", () => {
          // toggleHighlight(false, cell === castlecell ? marker : null, cell);
        });
      }
    });
  });
});
