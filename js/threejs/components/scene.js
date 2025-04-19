// Imports the core Three.js library
import * as THREE from "three";
// Imports the EXRLoader for loading HDR environment maps
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";

// Defines an asynchronous function to create a Three.js scene
async function createScene() {
  // Creates a new Three.js scene
  const scene = new THREE.Scene();

  // Loads an HDR environment map asynchronously
  const hdrTexture = await new EXRLoader()
    // Sets the base path for the HDR file
    .setPath("../media/")
    // Loads the EXR file (venice_sunset_1k.exr)
    .loadAsync("venice_sunset_1k.exr");

  // Configures the HDR texture for equirectangular reflection mapping (360 degree image)
  hdrTexture.mapping = THREE.EquirectangularReflectionMapping;

  // Sets the HDR texture as the scene’s environment map for lighting/reflections
  scene.environment = hdrTexture;
  // Sets a solid dark background color (hex: #201c1c)
  scene.background = new THREE.Color().setHex(0x201c1c);
  // Dispose of environment texture to avoid memory leaks
  scene.environment.dispose();
  // Returns the configured scene
  return scene;
}

// Exports the createScene function for use in other modules
export { createScene };
