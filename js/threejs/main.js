// Imports camera creation function for setting up the 3D view perspective
import { createCamera } from "./components/camera.js";
// Imports scene creation function for the 3D environment
import { createScene } from "./components/scene.js";
// Imports controls setup for user interaction with the 3D scene
import { createControls } from "./systems/controls.js";
// Imports renderer setup for rendering the 3D scene to the canvas
import { createRenderer } from "./systems/renderer.js";
// Imports Resizer for handling canvas resizing
import { Resizer } from "./systems/Resizer.js";
// Imports Loop for managing the animation loop
import { Loop } from "./systems/Loop.js";
// Imports model importer for loading 3D models
import { importModel } from "./systems/importer.js";
// Imports Stats for performance monitoring
import Stats from "three/addons/libs/stats.module.js";

// Declares global variables for Three.js components
let camera;
let controls;
let renderer;
let scene;
let loop;
let model;
let stats;

// Defines a class to manage a Three.js 3D scene
class Three {
  // Constructor takes a canvas container and model name
  constructor(container) {
    // Initializes camera for 3D perspective
    camera = createCamera();
    // Sets up Stats for FPS and performance tracking
    stats = Stats();
    // Stores the canvas container
    this.container = container;

    // Commented-out: Adds Stats panel to the DOM (for debugging)
    // document.body.appendChild(stats.dom);
  }

  // Initializes the 3D scene and components asynchronously
  async init(model) {
    // Creates scene with environment and background
    scene = await createScene(model);
    // Creates renderer for WebGL rendering
    renderer = await createRenderer(this.container);

    // Sets up controls for camera interaction
    controls = createControls(camera, renderer.domElement);

    // Initializes animation loop for continuous rendering
    loop = new Loop(camera, scene, renderer);
    // Adds model to the animation loop for updates
    loop.updatables.push(model);
    // Adds controls to the loop for user input handling
    loop.updatables.push(controls);

    // Defines Stats update function
    // stats.tick = () => {
    //   stats.update();
    // };
    // Adds Stats to the loop for performance tracking
    // loop.updatables.push(stats);

    // Creates Resizer to handle canvas resizing
    const resizer = new Resizer(renderer.domElement, camera, renderer, scene);
    // Adds Resizer to the loop for dynamic resizing
    loop.updatables.push(resizer);
  }

  async loadModel(modelName) {
    // Loads the specified 3D model
    return (model = await importModel(modelName));
  }

  // Starts the animation loop for continuous rendering
  start() {
    loop.start();
  }

  // Stops the animation loop
  stop() {
    loop.stop();
  }
}

// Exports the Three class for use in other modules
export { Three };
