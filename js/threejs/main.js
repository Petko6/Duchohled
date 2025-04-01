import { createCamera } from "./components/camera.js";
import { createScene } from "./components/scene.js";

import { createControls } from "./systems/controls.js";
import { createRenderer } from "./systems/renderer.js";
import { Resizer } from "./systems/Resizer.js";
import { Loop } from "./systems/Loop.js";
import { importModel } from "./systems/importer.js";

import Stats from "three/addons/libs/stats.module.js";

let camera;
let controls;
let renderer;
let scene;
let loop;
let model;
let stats;

class Three {
  constructor(container, modelName) {
    camera = createCamera();
    stats = Stats();
    this.container = container;
    this.modelName = modelName;

    document.body.appendChild(stats.dom);
  }
  
  async init() {
    renderer = await createRenderer(this.container);
    scene = await createScene();
    model = await importModel(this.modelName);
    controls = createControls(camera, renderer.domElement);

    loop = new Loop(camera, scene, renderer);
    loop.updatables.push(model);

    loop.updatables.push(controls);
    scene.add(model);

    stats.tick = () => {
      stats.update();
    };
    loop.updatables.push(stats);

    const resizer = new Resizer(renderer.domElement, camera, renderer, scene);
    loop.updatables.push(resizer);
  }

  render() {
    // draw a single frame
    renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

export { Three };
