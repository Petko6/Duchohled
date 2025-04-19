import { PerspectiveCamera } from "three";

function createCamera() {
  const camera = new PerspectiveCamera(
    60, // fov = Field Of View
    1, // aspect ratio (dummy value), we will be changing that down the line
    0.25, // near clipping plane
    200 // far clipping plane
  );

  // move the camera back and up so we can view the scene
  camera.position.set(0, 10, 20);

  return camera;
}

export { createCamera };
