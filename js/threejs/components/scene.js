import { Scene, EquirectangularReflectionMapping, Color } from "three";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";

// Creates a Three.js scene with an HDR environment map
async function createScene(model) {
  // Initialize scene
  const scene = new Scene();

  scene.add(model);

  let exrTextureName = "venice_sunset_1k.exr";

  // Cache name for storing assets
  const CACHE_NAME = "model-cache";
  const exrUrl = `../media/${exrTextureName}`;
  let hdrTexture;

  // Attempt to load EXR texture from cache or file
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(exrUrl);

    if (cachedResponse) {
      // Load texture from cache
      const blob = await cachedResponse.blob();
      const blobUrl = URL.createObjectURL(blob);
      hdrTexture = await new EXRLoader().loadAsync(blobUrl);
      URL.revokeObjectURL(blobUrl); // Clean up
    } else {
      // Load texture from file and store in cache
      hdrTexture = await new EXRLoader()
        .setPath("../media/")
        .loadAsync(exrTextureName);

      // Cache the texture data
      try {
        const response = await fetch(exrUrl);
        if (!response.ok)
          throw new Error(`Failed to fetch EXR texture ${exrTextureName}`);
        await cache.put(exrUrl, response.clone());
      } catch (error) {
        console.warn(`Failed to cache EXR texture ${exrTextureName}:`, error);
      }
    }
  } catch (error) {
    console.error(`Error loading EXR texture ${exrTextureName}:`, error);
    throw error;
  }

  // Configure texture for equirectangular reflection mapping
  hdrTexture.mapping = EquirectangularReflectionMapping;

  // Set scene environment and background
  scene.environment = hdrTexture;
  scene.background = new Color().setHex(0x201c1c);

  // Add dispose method to clean up resources
  scene.dispose = function () {
    if (scene.environment) {
      scene.environment.dispose();
    }
  };

  // Return the configured scene
  return scene;
}

export { createScene };
