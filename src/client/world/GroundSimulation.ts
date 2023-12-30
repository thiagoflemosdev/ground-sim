import {
  CircleGeometry,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  SphereGeometry,
  Vector3,
} from "three";
import { PARTICLES_SPAWNER, PARTICLE_RADIUS } from "../config/constants";
import { AssetsController } from "../controllers/AssetsController";
import { World } from "./World";
import { Particle } from "./Particle";

export class GroundSimulation extends World {
  private particlesList: Particle[] = [];
  private particlesMaterial: MeshStandardMaterial;

  constructor() {
    super();

    this.particlesMaterial = new MeshStandardMaterial({
      color: 0xff0000,
    });
  }

  public init() {
    super.init();

    const geometry = new PlaneGeometry(100, 100);
    const mesh = new Mesh(
      geometry,
      new MeshStandardMaterial({
        color: 0xcccccc,
      })
    );
    mesh.rotation.x = Math.PI / -2;
    mesh.position.y = -PARTICLE_RADIUS;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
  }

  public clearParticles() {
    this.particlesList.forEach((particle) => {
      particle.mesh.geometry.dispose();
      this.scene.remove(particle.mesh);
    });

    this.particlesList.splice(0, this.particlesList.length);
  }

  public drawParticles() {
    for (let x = 0; x < PARTICLES_SPAWNER.width; x++) {
      for (let y = 0; y < PARTICLES_SPAWNER.height; y++) {
        for (let z = 0; z < PARTICLES_SPAWNER.depth; z++) {
          this.addParticle(new Vector3(x, y + PARTICLES_SPAWNER.elevation, z));
        }
      }
    }
  }

  private addParticle(position: Vector3) {
    const particle = new Particle(position, this.particlesMaterial);
    this.scene.add(particle.mesh);
    this.particlesList.push(particle);
  }

  protected update() {
    super.update();

    this.particlesList.forEach((element) => {
      element.update();
    });
  }
}
