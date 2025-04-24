// Imports WebGPURenderer for modern GPU-based rendering
import { WebGPURenderer } from "three/webgpu";
// Imports Three.js core for rendering utilities
import { LinearToneMapping } from "three";

// Creates a WebGPU renderer for a canvas asynchronously
async function createRenderer(container) {
  // Checks for WebGPU support in the browser
  if (!navigator.gpu) {
    // Logs error if WebGPU is unavailable
    console.error("WebGPU is not supported in this browser.");
  }

  // Initializes WebGPURenderer with the provided canvas
  const renderer = new WebGPURenderer({
    canvas: container, // Targets the canvas element
    antialias: true, // Enables smoother edges
    alpha: false, // Disables transparent background
  });
  // Initializes the WebGPU backend for rendering
  await renderer.init();
  // Uses linear tone mapping for natural lighting
  renderer.toneMapping = LinearToneMapping;
  // Adjusts exposure for brighter visuals
  renderer.toneMappingExposure = 1.2;
  // Enables realistic light calculations
  renderer.physicallyCorrectLights = true;

  // Returns the configured renderer
  return renderer;
}

// Exports createRenderer for use in other modules
export { createRenderer };
