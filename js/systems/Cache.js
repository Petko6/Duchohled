// Preload 3D model and texture files to improve performance
export async function preloadAssets(
    modelName = null,
    exrTextureName = "venice_sunset_1k.exr"
  ) {
    try {
      const cache = await caches.open("model-cache");

      // Preload the 3D model if a model name is provided
      if (modelName) {
        const modelUrl = `../models/${modelName}.glb`;
        const cachedModel = await cache.match(modelUrl);
        if (!cachedModel) {
          const response = await fetch(modelUrl);
          if (!response.ok)
            throw new Error(`Failed to fetch model ${modelName}`);
          await cache.put(modelUrl, response.clone());
        }
      }

      // Preload the EXR texture file
      const exrUrl = `../media/${exrTextureName}`;
      const cachedExr = await cache.match(exrUrl);
      if (!cachedExr) {
        const response = await fetch(exrUrl);
        if (!response.ok)
          throw new Error(`Failed to fetch EXR texture ${exrTextureName}`);
        await cache.put(exrUrl, response.clone());
      }
    } catch (error) {
      console.error(
        `Preload error for ${modelName || exrTextureName}:`,
        error
      );
    }
  }