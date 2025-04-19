// Imports Three.js core for 3D scene management
import * as THREE from "three";
// Imports GLTFLoader for loading 3D models in GLTF format
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Asynchronously loads and configures a 3D model
async function importModel(modelName) {
  // Initializes GLTFLoader with the models directory path
  const gltfLoader = new GLTFLoader().setPath("../models/");
  // Loads the specified GLB model file asynchronously
  const gltf = await gltfLoader.loadAsync(`/${modelName}.glb`);

  // Extracts the model’s scene (3D object hierarchy)
  const model = gltf.scene;
  // Retrieves any animations included in the model
  const clip = gltf.animations;

  // Creates an AnimationMixer to manage model animations
  const mixer = new THREE.AnimationMixer(model);
  // Defines a tick function to update animations each frame
  model.tick = (delta) => {
    // Advances the animation mixer by the frame’s time delta
    mixer.update(delta);
    // Plays all animation clips in the model
    clip.forEach((clip) => {
      mixer.clipAction(clip).play();
    });
  };
  // Returns the configured model for scene integration
  return model;
}

// Exports importModel for use in other modules
export { importModel };
