// Declares global variables for the main map and footer map
let map;
let footermap;

// Defines the geographical bounds for the Czech Republic to restrict map panning
let bounds = [
  [48.5, 12.1], // Southwest corner
  [51.1, 18.9], // Northeast corner
];

// Defines a utility function to toggle highlight styles on markers and cells
const toggleHighlight = (on, marker, cell) => {
  // Toggles the 'highlight' class on the cell if it exists
  if (cell) cell.classList.toggle("highlight", on);
  // Toggles the 'marker-highlight' class on the marker's DOM element if it exists
  if (marker?.getElement()) {
    marker.getElement().classList.toggle("marker-highlight", on);
  }
};

// Runs code after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Detects mobile devices based on screen width (<1000px)
  const isMobile = window.innerWidth < 1000;

  // Initializes the main map only on non-mobile devices
  if (!isMobile) {
    // Creates a Leaflet map centered on the Czech Republic with restricted zoom and panning
    map = L.map("map", {
      scrollWheelZoom: false, // Disables scroll zoom by default
      wheelDebounceTime: 20, // Debounces wheel events
      center: [50, 15], // Center of Czech Republic
      zoom: 7, // Initial zoom level
      maxBounds: bounds, // Restricts map to defined bounds
      maxBoundsViscosity: 0.7, // Adds resistance when panning outside bounds
    });

    // Refreshes AOS animations when the map loads
    map.on("load", function () {
      AOS.refreshHard(); // Recalculates animation positions
    });

    // Adds a Jawg tile layer for map rendering
    L.tileLayer(
      "https://tile.jawg.io/4d82d3b9-0ca1-4b9d-a6d0-c598dd8291c7/{z}/{x}/{y}{r}.png?access-token=Vljwn5szVctkG5hh1b5nR3oHzd3T9mW1gSO66SwVJ53KL70VC4sl3rezA1OpAcqt",
      {
        maxZoom: 10, // Maximum zoom level
        minZoom: 7, // Minimum zoom level
      }
    ).addTo(map);
  }

  // Implements custom scroll zoom behavior for the main map on desktop
  if (!isMobile) {
    // Gets the map container and zoom limits
    const container = map.getContainer();
    const minZoom = map.getMinZoom();
    const maxZoom = map.getMaxZoom();

    // Defines delays for enabling/disabling scroll zoom
    const ENABLE_DELAY = 20; // Fast enable delay (ms)
    const DISABLE_DELAY = 500; // Slower disable delay (ms)

    // Tracks zoom state: 'idle', 'pendingEnable', 'enabled', 'pendingDisable'
    let state = "idle";
    let timerId = null;
    let lastDelta = 0;

    // Helper: Resets to idle state and disables scroll zoom
    function toIdle() {
      clearTimeout(timerId);
      map.scrollWheelZoom.disable();
      state = "idle";
    }

    // Helper: Schedules a function to run after a delay
    function schedule(fn, delay) {
      clearTimeout(timerId);
      timerId = setTimeout(fn, delay);
    }

    // Handles wheel events to enable/disable scroll zoom dynamically
    container.addEventListener(
      "wheel",
      (e) => {
        const delta = e.deltaY; // Scroll direction
        const z = map.getZoom(); // Current zoom level
        const canZoomIn = delta < 0 && z < maxZoom; // Can zoom in
        const canZoomOut = delta > 0 && z > minZoom; // Can zoom out
        const actionable = canZoomIn || canZoomOut; // Zoom is possible

        // Manages state transitions based on zoom conditions
        switch (state) {
          case "idle":
            if (actionable) {
              state = "pendingEnable";
              schedule(() => {
                map.scrollWheelZoom.enable();
                state = "enabled";
              }, ENABLE_DELAY);
              e.preventDefault(); // Prevents page scroll
            }
            break;
          case "pendingEnable":
            e.preventDefault(); // Blocks page scroll during enable delay
            break;
          case "enabled":
            e.preventDefault(); // Blocks page scroll while zooming
            if ((delta < 0 && z >= maxZoom) || (delta > 0 && z <= minZoom)) {
              state = "pendingDisable";
              schedule(() => toIdle(), DISABLE_DELAY);
            }
            break;
          case "pendingDisable":
            e.preventDefault(); // Blocks page scroll
            if (delta * lastDelta < 0) {
              // Reverses scroll direction
              clearTimeout(timerId);
              state = "enabled";
            }
            break;
        }

        lastDelta = delta; // Tracks last scroll direction
      },
      { passive: false } // Allows preventing default scroll
    );

    // Disables scroll zoom when the mouse leaves the map
    container.addEventListener("mouseleave", () => {
      toIdle();
    });
  }

  // Defines an array of castles with details for map markers and list cells
  let castles = [
    {
      name: "Houska",
      coords: [50.485, 14.653],
      icon: "./media/erby/houska.svg",
      url: "./houska",
      divId: "houska",
    },
    {
      name: "Loket",
      coords: [50.185, 12.751],
      icon: "./media/erby/loket.svg",
      url: "./loket",
      divId: "loket",
    },
    {
      name: "Rožmberk",
      coords: [48.615, 14.372],
      icon: "./media/erby/rozmberk.svg",
      url: "./rozmberk",
      divId: "rozmberk",
    },
    {
      name: "Radyně",
      coords: [49.663, 13.432],
      icon: "./media/erby/radyne.svg",
      url: "./radyne",
      divId: "radyne",
    },
    {
      name: "Vrškamýk",
      coords: [49.651, 14.093],
      icon: "./media/erby/vrskamyk.svg",
      url: "./vrskamyk",
      divId: "vrskamyk",
    },
    {
      name: "Kašperk",
      coords: [49.171, 13.563],
      icon: "./media/erby/kasperk.svg",
      url: "./kasperk",
      divId: "kasperk",
    },
  ];

  // Iterates over castles to add markers and handle interactions
  castles.forEach((castle) => {
    // Declares variables for marker and preload state
    let label;
    let marker;
    let isModelPreloaded = false; // Prevents repeated model loading

    // Creates a marker with a custom icon on desktop only
    if (!isMobile) {
      let castleIcon = L.icon({
        iconUrl: castle.icon, // Castle-specific SVG icon
        iconSize: [32, 32], // Icon dimensions
        iconAnchor: [16, 32], // Anchor point (bottom center)
        popupAnchor: [0, -32], // Popup position
        className: `pin-${castle.divId}`, // Custom class for styling
      });

      // Adds the marker to the map at the castle's coordinates
      marker = L.marker(castle.coords, {
        icon: castleIcon,
      }).addTo(map);
    }

    // Gets the DOM element (cell) for the castle in the list
    let castlecell = document.getElementById(castle.divId);

    // Lazy-loads a WebP background image for the castle cell
    const img = new Image();
    img.src = `./media/hrady/${castle.divId}.webp`;
    img.onload = () => {
      castlecell.style.background = `url('${img.src}') no-repeat top/cover`;
    };

    // Commented-out function to preload a 3D model (not currently used)
    // const preloadModel = () => {
    //   if (!isModelPreloaded) {
    //     fetch(`./models/${castle.divId}.glb`, {
    //       method: "GET",
    //       cache: "force-cache",
    //     })
    //       .then(() => {
    //         isModelPreloaded = true;
    //         console.log(`Model pro ${castle.name} předběžně načten.`);
    //       })
    //       .catch((error) => {
    //         console.error(
    //           `Chyba při načítání modelu pro ${castle.name}:`,
    //           error
    //         );
    //       });
    //   }
    // };

    // Opens the castle's page when the marker is clicked
    marker?.on("click", () => {
      window.location.href = castle.url;
    });

    // Adds hover effects for markers on desktop
    if (!isMobile) {
      marker?.on("mouseover", () => {
        toggleHighlight(true, marker, castlecell); // Highlights marker and cell
        // preloadModel();
      });
      marker?.on("mouseout", () => toggleHighlight(false, marker, castlecell)); // Removes highlight
    }

    // Adds hover effects for the castle cell (works on mobile and desktop)
    castlecell.addEventListener("pointerenter", () => {
      toggleHighlight(true, marker, castlecell); // Highlights cell and marker
      // preloadModel();
    });
    castlecell.addEventListener("pointerleave", () => {
      toggleHighlight(false, marker, castlecell); // Removes highlight
    });

    // Removes highlight on touch end for mobile devices
    if (isMobile) {
      document.addEventListener("touchend", () => {
        toggleHighlight(false, marker, castlecell);
      });
    }

    // Opens the castle's page when the cell is clicked
    castlecell.addEventListener("click", () => {
      window.location.href = castle.url;
    });
  });

  // Initializes the footer map centered on Prague Castle
  let footerMarker;
  footermap = L.map("footermap", {
    center: [50.0907895, 14.4021669], // Prague Castle coordinates
    zoom: 17, // Detailed zoom level
    maxBounds: bounds, // Restricts panning to Czech Republic
    maxBoundsViscosity: 0.7, // Adds resistance outside bounds
  });

  // Adds a Jawg tile layer for the footer map
  L.tileLayer(
    "https://tile.jawg.io/4d82d3b9-0ca1-4b9d-a6d0-c598dd8291c7/{z}/{x}/{y}{r}.png?access-token=Vljwn5szVctkG5hh1b5nR3oHzd3T9mW1gSO66SwVJ53KL70VC4sl3rezA1OpAcqt",
    {
      maxZoom: 20, // Higher max zoom for detail
      minZoom: 10, // Minimum zoom level
    }
  ).addTo(footermap);

  // Creates a custom icon for the footer map marker
  const duchohledIcon = L.icon({
    iconUrl: "./media/svg/logo.svg", // Duchohled logo icon
    iconSize: [40, 40], // Icon dimensions
    iconAnchor: [20, 20], // Anchor point (center)
    className: "duchohled-marker", // Custom class for styling
  });

  // Adds a marker for the address Na Florenci 2139/2
  footerMarker = L.marker([50.0907895, 14.4021669], {
    icon: duchohledIcon,
  })
    .addTo(footermap)
    // Opens an external map link when clicked
    .on("click", () => {
      window.location.href =
        "https://mapy.cz/zakladni?source=coor&id=14.401989874205015%2C50.09066215820785&x=14.4019899&y=50.0906622&z=17";
    });

  // Adds hover effects for the footer marker  marker
  footerMarker.on("mouseover", () => {
    toggleHighlight(true, footerMarker);
  });
  footerMarker.on("mouseout", () => {
    toggleHighlight(false, footerMarker);
  });
});
