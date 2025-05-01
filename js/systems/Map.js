// Define geographical boundaries for the Czech Republic to limit map panning
const bounds = [
  [48.5, 12.1], // Southwest corner of the Czech Republic
  [51.1, 18.9], // Northeast corner of the Czech Republic
];

export async function initMap(mapElement, labels, castles) {
  let map;
  // Create a Leaflet map centered on the Czech Republic with restricted zoom and panning
  map = await L.map(mapElement, {
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

  // Implement custom scroll zoom behavior for the main map

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

  return map;
}

export async function initFooterMap(mapElement) {
  let footermap;
  // Initialize the footer map centered on Prague Castle
  footermap = await L.map(mapElement, {
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

  return footermap;
}
