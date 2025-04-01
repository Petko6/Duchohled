import { WebGPURenderer } from "three/webgpu";
import * as THREE from "three";

async function createRenderer(container) {
  if (!navigator.gpu) {
    console.error("WebGPU is not supported in this browser.");
  }

  // Renderer
  const renderer = new WebGPURenderer({
    canvas: container,
    antialias: true,
    alpha: false,
  });
  await renderer.init(); // Inicializace WebGPU backendu
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.LinearToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.physicallyCorrectLights = true;

  return renderer;
}

export { createRenderer };
