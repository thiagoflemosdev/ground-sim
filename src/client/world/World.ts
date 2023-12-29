import {
  Color,
  DirectionalLight,
  DirectionalLightHelper,
  PerspectiveCamera,
  Scene,
  sRGBEncoding,
  WebGLRenderer,
  CameraHelper,
} from "three";
import { MapControls } from "three/examples/jsm/controls/OrbitControls";

export class World {
  protected scene = new Scene();
  protected camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  protected renderer = new WebGLRenderer();
  protected controls = new MapControls(this.camera, this.renderer.domElement);

  constructor() {
    this.camera.position.z = 0;
    this.camera.position.y = 35;

    this.camera.lookAt(0, 0, 0);

    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.physicallyCorrectLights = true;

    this.scene.background = new Color(0xffffff);

    const light = new DirectionalLight(0xffffff, 1);
    light.position.set(60, 100, 40);
    light.target.position.set(0, 30, 0);
    light.castShadow = true;

    const offLight = new DirectionalLight(0xdfeaf5, 0.8);
    offLight.position.set(0, 30, 0);
    offLight.target.position.set(60, 100, 40);

    this.scene.add(light);
    this.scene.add(offLight);

    document.body.appendChild(this.renderer.domElement);
    window.addEventListener("resize", () => this.onWindowResize(), false);

    this.renderer.setAnimationLoop(() => this.update());

    this.update();
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.render();
  }

  protected render() {
    this.renderer.render(this.scene, this.camera);
  }

  protected update() {
    this.controls.update();

    this.render();
  }
}
