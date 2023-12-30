import { Material, Mesh, SphereGeometry, Vector3 } from "three";
import {
  GRAVITY_VALUE,
  PARTICLE_RADIUS,
  VELOCITY_DAMPEN_VALUE,
} from "../config/constants";

export class Particle {
  public mesh: Mesh;
  public velocity = new Vector3();

  constructor(public position: Vector3, material: Material) {
    const geometry = new SphereGeometry(PARTICLE_RADIUS);

    this.mesh = new Mesh(geometry, material);
    this.mesh.position.x = position.x;
    this.mesh.position.y = position.y;
    this.mesh.position.z = position.z;

    this.mesh.castShadow = true;
  }

  public update() {
    this.velocity.add(GRAVITY_VALUE);

    this.mesh.position.add(this.velocity);

    if (this.mesh.position.y < 0) {
      this.mesh.position.y = 0;
      this.velocity.set(
        this.velocity.x,
        -this.velocity.y * VELOCITY_DAMPEN_VALUE,
        this.velocity.z
      );
    }
  }
}
