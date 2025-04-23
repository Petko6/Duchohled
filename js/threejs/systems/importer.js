import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Asynchronously loads and configures a 3D model with optional preloaded data
async function importModel(modelName, preloadedData = null) {
  // Initialize GLTFLoader for loading GLTF/GLB models
  const gltfLoader = new GLTFLoader();
  let gltf;

  // Cache name for storing models
  const CACHE_NAME = "model-cache";

  if (preloadedData) {
    // Process preloaded data (ArrayBuffer)
    try {
      gltf = await gltfLoader.parseAsync(preloadedData, "");
    } catch (error) {
      console.error(`Error parsing preloaded model ${modelName}:`, error);
      throw error;
    }
  } else {
    // Attempt to load from cache or file
    try {
      const cache = await caches.open(CACHE_NAME);
      const url = `../models/${modelName}.glb`;
      const cachedResponse = await cache.match(url);

      if (cachedResponse) {
        // Load model from cache
        const arrayBuffer = await cachedResponse.arrayBuffer();
        gltf = await gltfLoader.parseAsync(arrayBuffer, "");
      } else {
        // Load model from file and store in cache
        gltf = await gltfLoader
          .setPath("../models/")
          .loadAsync(`/${modelName}.glb`);

        // Cache the model data
        try {
          const arrayBuffer = await (await fetch(url)).arrayBuffer();
          await cache.put(url, new Response(arrayBuffer));
        } catch (error) {
          console.warn(`Failed to cache model ${modelName}:`, error);
        }
      }
    } catch (error) {
      console.error(`Error loading model ${modelName}:`, error);
      throw error;
    }
  }

  // Extract the model’s scene and animations
  const model = gltf.scene;
  const clip = gltf.animations;

  // Set up AnimationMixer for model animations
  const mixer = new THREE.AnimationMixer(model);
  model.tick = (delta) => {
    // Update animations based on frame delta
    mixer.update(delta);
    clip.forEach((clip) => {
      mixer.clipAction(clip).play();
    });
  };

  // Return the configured model
  return model;
}

export { importModel };
