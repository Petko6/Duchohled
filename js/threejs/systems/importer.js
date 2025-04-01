import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

async function importModel(modelName) {
  const gltfLoader = new GLTFLoader().setPath("./models/");
  const gltf = await gltfLoader.loadAsync(`/${modelName}.glb`);

  const model = gltf.scene;
  const clip = gltf.animations;

  const mixer = new THREE.AnimationMixer(model);
  model.tick = (delta) => {
    mixer.update(delta);
    clip.forEach((clip) => {
      mixer.clipAction(clip).play();
    });
  };
  return model;
}

export { importModel };
