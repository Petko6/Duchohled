import * as THREE from "three";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";

async function createScene() {
  const scene = new THREE.Scene();

  // HDR mapa prostředí
  const hdrTexture = await new EXRLoader()
    .setPath("./media/")
    .loadAsync("venice_sunset_1k.exr");

  hdrTexture.mapping = THREE.EquirectangularReflectionMapping;

  scene.environment = hdrTexture;
  scene.background = new THREE.Color().setHex(0x201c1c);

  return scene;
}

export { createScene };
