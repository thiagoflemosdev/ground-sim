import {
  Color,
  Mesh,
  MeshStandardMaterial,
  RGBAFormat,
  SphereGeometry,
  Vector3,
} from "three";
import {
  GRAVITY_VALUE,
  MIN_DENSITY,
  PARTICLE_RADIUS,
  SIMULATION_ATTRIBUTES,
  VELOCITY_DAMPEN_VALUE,
} from "../config/constants";
import { colorLerp, randomRange } from "../utils/math";

export class Particle {
  public mesh: Mesh<SphereGeometry, MeshStandardMaterial>;
  public velocity = new Vector3();
  public density: number = MIN_DENSITY;

  constructor(position: Vector3) {
    const geometry = new SphereGeometry(PARTICLE_RADIUS);

    this.mesh = new Mesh(
      geometry,
      new MeshStandardMaterial({
        color: this.getColor(),
      })
    );
    this.mesh.position.x = position.x;
    this.mesh.position.y = position.y;
    this.mesh.position.z = position.z;

    this.mesh.castShadow = true;
  }

  public update() {
    if (this.density > SIMULATION_ATTRIBUTES.targetDensity) {
      const pressure = this.density / SIMULATION_ATTRIBUTES.targetDensity;

      this.velocity = this.velocity.add(
        new Vector3(
          pressure *
            randomRange(-1, 1) *
            SIMULATION_ATTRIBUTES.pressureMultiplier,
          pressure *
            randomRange(-1, 1) *
            SIMULATION_ATTRIBUTES.pressureMultiplier,
          pressure *
            randomRange(-1, 1) *
            SIMULATION_ATTRIBUTES.pressureMultiplier
        )
      );
    } else {
      this.velocity = new Vector3(
        this.velocity.x * SIMULATION_ATTRIBUTES.dragMultiplier,
        this.velocity.y * SIMULATION_ATTRIBUTES.dragMultiplier,
        // this.velocity.y,
        this.velocity.z * SIMULATION_ATTRIBUTES.dragMultiplier
      );
    }

    this.velocity.add(GRAVITY_VALUE);

    this.mesh.position.add(this.velocity);

    this.mesh.material.color = this.getColor();

    if (this.mesh.position.y < 0) {
      this.mesh.position.y = 0;
      this.velocity.set(
        this.velocity.x,
        -this.velocity.y * VELOCITY_DAMPEN_VALUE,
        this.velocity.z
      );
    }
  }

  private getColor() {
    if (this.density > SIMULATION_ATTRIBUTES.targetDensity) {
      return colorLerp(
        new Color(1, 0, 0),
        new Color(1, 1, 1),
        SIMULATION_ATTRIBUTES.targetDensity / this.density
      );
    } else {
      return colorLerp(
        new Color(0, 0, 1),
        new Color(1, 1, 1),
        this.density / SIMULATION_ATTRIBUTES.targetDensity
      );
    }
  }
}
