// Imports the core Three.js library
import * as THREE from "three";

// Defines an asynchronous function to create a Three.js scene
async function createScene(model) {
  // Creates a new Three.js scene
  const scene = new THREE.Scene();

  // Adds model to the scene for rendering
  scene.add(model);

  const environmentTexture = await new THREE.TextureLoader()
    // Sets the base path
    .setPath("../media/")
    // Loads the environment texture
    .loadAsync("environment.jpg");

  environmentTexture.mapping = THREE.EquirectangularReflectionMapping;

  // Sets the environment texture as the scene’s environment map for lighting/reflections
  scene.environment = environmentTexture;
  // Sets a solid dark background color (hex: #201c1c)
  scene.background = new THREE.Color().setHex(0x201c1c);

  // Returns the configured scene
  return scene;
}

// Exports the createScene function for use in other modules
export { createScene };
