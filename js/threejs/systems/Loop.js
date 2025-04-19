// Imports Three.js core for 3D rendering utilities
import * as THREE from "three";

// Creates a clock to track time deltas between frames
const clock = new THREE.Clock();

// Defines a class to manage the animation loop for a Three.js scene
class Loop {
  // Constructor takes camera, scene, and renderer for rendering
  constructor(camera, scene, renderer) {
    // Stores camera for view perspective
    this.camera = camera;
    // Stores scene containing 3D objects
    this.scene = scene;
    // Stores renderer for WebGL rendering
    this.renderer = renderer;
    // Initializes array to hold objects with tick functions
    this.updatables = [];
  }

  // Starts the animation loop for continuous rendering
  start() {
    // Sets up a browser animation loop
    this.renderer.setAnimationLoop(() => {
      // Updates all animatable objects for the frame
      this.tick();
      // Renders the scene with the current camera view
      this.renderer.render(this.scene, this.camera);
    });
  }

  // Stops the animation loop
  stop() {
    // Clears the animation loop to halt rendering
    this.renderer.setAnimationLoop(null);
  }

  // Updates all animatable objects for the current frame
  tick() {
    // Gets time since last frame for smooth animations
    const delta = clock.getDelta();

    // Commented-out: Logs frame time for debugging
    // console.log(
    //   `The last frame rendered in ${delta * 1000} milliseconds`,
    // );

    // Calls tick function on each updatable object with time delta
    for (const object of this.updatables) {
      object.tick(delta);
    }
  }
}

// Exports Loop class for use in other modules
export { Loop };
