// Imports OrbitControls addon for interactive camera rotation and zoom
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Creates controls for camera interaction with a 3D scene
function createControls(camera, canvas) {
  // Initializes OrbitControls, linking the camera and canvas for user-driven rotation and zoom
  const controls = new OrbitControls(camera, canvas);

  // Enables smooth damping for natural camera movement
  controls.enableDamping = true;
  // Sets minimum zoom distance to prevent clipping into the model
  controls.minDistance = 10;
  // Sets maximum zoom distance to keep the model in view
  controls.maxDistance = 25;

  // Defines a tick function to update controls each frame, ensuring responsiveness to canvas changes
  controls.tick = () => controls.update();

  // Returns controls for additional proccesing
  return controls;
}

// Exports createControls for use in other modules
export { createControls };
