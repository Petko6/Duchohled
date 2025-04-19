// Defines a class to render an image on a canvas element
class ImageRenderer {
  // Constructor takes a canvas element and image name as parameters
  constructor(container, imageName) {
    // Creates a new HTMLImageElement for the image
    const image = new Image();

    // Sets up an event handler to draw the image once it’s loaded
    image.onload = function () {
      drawResizedImage();
    };

    // Sets the image source to a WebP file in the ../media/ilustrace directory
    image.src = `../media/ilustrace/${imageName}.webp`;

    /**
     * Draws the image on the canvas to cover the entire area
     * (mimics CSS background-size: cover, preserving aspect ratio and cropping as needed)
     */
    function drawImageCover(ctx, img, canvasWidth, canvasHeight) {
      // Calculates the aspect ratios of the image and canvas
      const imgRatio = img.width / img.height; // Image aspect ratio
      const canvasRatio = canvasWidth / canvasHeight; // Canvas aspect ratio

      // Initializes variables for drawing dimensions and offsets
      let drawWidth, drawHeight;
      let offsetX = 0,
        offsetY = 0;

      // Handles case where image is wider than canvas (crops horizontally)
      if (imgRatio > canvasRatio) {
        drawHeight = canvasHeight; // Matches canvas height
        drawWidth = img.width * (canvasHeight / img.height); // Scales width
        offsetX = -(drawWidth - canvasWidth) / 2; // Centers horizontally
        // Handles case where image is taller than canvas (crops vertically)
      } else {
        drawWidth = canvasWidth; // Matches canvas width
        drawHeight = img.height * (canvasWidth / img.width); // Scales height
        offsetY = -(drawHeight - canvasHeight) / 2; // Centers vertically
      }

      // Draws the image with calculated dimensions and offsets
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    /**
     * Resizes the canvas to match its display size and device pixel ratio
     * Ensures crisp rendering on high-DPI displays
     * Returns a 2D context ready for drawing
     */
    function resizeCanvasToDisplaySize(canvas) {
      // Gets the device pixel ratio (e.g., 2 for Retina displays)
      const dpr = window.devicePixelRatio || 1;
      // Gets the CSS width and height of the canvas
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      // Sets the canvas’s pixel dimensions based on DPR
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      // Gets the 2D context, disabling alpha for performance
      const ctx = canvas.getContext("2d", { alpha: false });
      // Scales the context to account for DPR
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return ctx;
    }

    // Draws the image on the canvas, resized and covering the area
    function drawResizedImage() {
      // Gets the 2D context, adjusted for DPR
      const ctx = resizeCanvasToDisplaySize(container);

      // Draws the image to cover the canvas like background-size: cover
      drawImageCover(ctx, image, container.clientWidth, container.clientHeight);
    }
  }
}

// Exports the ImageRenderer class for use in other modules
export { ImageRenderer };
