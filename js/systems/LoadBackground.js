// Function to load a background image asynchronously
export async function loadBackground(element, imagePath, fallbackPath, elementId) {
    try {
      // Create a new Image object
      const img = new Image();
      
      // Wrap the image loading in a Promise to handle onload and onerror
      const loadImage = new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load background for ${elementId}`));
        img.src = imagePath; // Set the image source to start loading
      });
  
      // Wait for the image to load
      await loadImage;
  
      // Set the background style with the loaded image
      element.style.background = `url('${img.src}') no-repeat top/cover`;
    } catch (error) {
      // Log the error and set the fallback background
      console.error(error.message);
      element.style.background = `url('${fallbackPath}') no-repeat top/cover`;
    }
  }