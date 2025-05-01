// Create a marker on the specified map with a custom icon
export async function createMarker(map, iconUrl, coords, options = {}) {
  // Default icon options for flexibility
  const defaultOptions = {
    iconSize: [32, 32], // Default icon size
    iconAnchor: [16, 32], // Default anchor (bottom center)
    popupAnchor: [0, -32], // Default popup position (above marker)
    className: `pin-${coords.toString()}`, // Default unique class
    ...options, // Merge with provided options
  };

  // Create a custom icon with the specified properties
  const icon = await L.icon({
    iconUrl, // URL of the icon image
    iconSize: defaultOptions.iconSize, // Size of the icon
    iconAnchor: defaultOptions.iconAnchor, // Anchor point of the icon
    popupAnchor: defaultOptions.popupAnchor, // Popup anchor point
    className: defaultOptions.className, // Custom CSS class
  });

  // Create and add the marker to the map
  const marker = L.marker(coords, {
    icon, // Assign the custom icon
  }).addTo(map);

  // Return the created marker
  return marker;
}
