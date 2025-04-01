import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function createControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas);

  controls.enableDamping = true;
  controls.minDistance = 15;
  controls.maxDistance = 25;
  //   controls.target.set(-1.5, 2.5, 0);

  // forward controls.update to our custom .tick method
  controls.tick = () => controls.update();

  return controls;
}

export { createControls };
