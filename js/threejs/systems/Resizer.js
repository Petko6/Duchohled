class Resizer {
  constructor(container, camera, renderer, scene) {
    this.container = container;
    this.camera = camera;
    this.renderer = renderer;
    this.scene = scene;
    // set initial size
    this.resizeCanvasToDisplaySize();
  }

  resizeCanvasToDisplaySize() {
    if (
      this.container.width !== this.container.clientWidth ||
      this.container.height !== this.container.clientHeight
    ) {
      this.renderer.setSize(
        this.container.clientWidth,
        this.container.clientHeight,
        false
      );
      this.camera.aspect =
        this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.onResize();
    }
  }

  tick() {
    this.resizeCanvasToDisplaySize();
  }

  onResize() {}
}

export { Resizer };
