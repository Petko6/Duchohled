// Defines a class to handle canvas resizing for a Three.js scene
class Resizer {
  // Constructor takes canvas, camera, renderer, and scene
  constructor(container, camera, renderer, scene) {
    // Stores canvas element for size tracking
    this.container = container;
    // Stores camera for projection updates
    this.camera = camera;
    // Stores renderer for size adjustments
    this.renderer = renderer;
    // Stores scene (for potential future use)
    this.scene = scene;
    // Sets initial canvas size to match display
    this.resizeCanvasToDisplaySize();
  }

  // Resizes canvas to match its display size
  resizeCanvasToDisplaySize() {
    // Checks if canvas size differs from display size
    if (
      this.container.width !== this.container.clientWidth ||
      this.container.height !== this.container.clientHeight
    ) {
      // Updates renderer size to match container’s CSS dimensions
      this.renderer.setSize(
        this.container.clientWidth,
        this.container.clientHeight,
        false
      );
      // Updates camera aspect ratio for correct perspective
      this.camera.aspect =
        this.container.clientWidth / this.container.clientHeight;
      // Recalculates camera projection matrix
      this.camera.updateProjectionMatrix();
      // Triggers custom resize callback
      this.onResize();
    }
  }

  // Updates canvas size each frame
  tick() {
    this.resizeCanvasToDisplaySize();
  }

  // Placeholder for custom resize event handling
  onResize() {}
}

// Exports Resizer class for use in other modules
export { Resizer };
