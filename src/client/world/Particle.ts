import {
  Color,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  Vector3,
} from "three";
import {
  GRAVITY_VALUE,
  MIN_DENSITY,
  PARTICLES_SPAWNER_ATTRIBUTES,
  PARTICLE_RADIUS,
  SIMULATION_ATTRIBUTES,
  VELOCITY_DAMPEN_VALUE,
} from "../config/constants";
import { colorLerp } from "../utils/math";

export class Particle {
  public mesh: Mesh<SphereGeometry, MeshStandardMaterial>;
  public velocity = new Vector3();
  public density = MIN_DENSITY;
  public predictedPosition: Vector3;
  public sortIndex = "";
  public index = 0;

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

    this.predictedPosition = position;
  }

  public update() {
    this.velocity.add(GRAVITY_VALUE);

    this.mesh.position.add(this.velocity);

    this.velocity.multiply(SIMULATION_ATTRIBUTES.dragMultiplier);

    this.checkCollisions();

    this.mesh.material.color = this.getColor();
  }

  public calculatePredictedPosition() {
    this.predictedPosition = new Vector3()
      .add(this.mesh.position)
      .add(this.velocity);
  }

  public calculateIndex(index: number) {
    this.index = index;

    this.sortIndex = `${Math.floor(
      this.mesh.position.x / SIMULATION_ATTRIBUTES.influenceRadius
    )}|${Math.floor(
      this.mesh.position.y / SIMULATION_ATTRIBUTES.influenceRadius
    )}|${Math.floor(
      this.mesh.position.z / SIMULATION_ATTRIBUTES.influenceRadius
    )}`;
  }

  private getColor() {
    const v = Math.max(this.velocity.x, this.velocity.y, this.velocity.z);
    const max = 0.2;
    return colorLerp(new Color(0, 0, 0), new Color(0, 1, 0), v / max);

    // if (this.density > SIMULATION_ATTRIBUTES.targetDensity) {
    //   return colorLerp(
    //     new Color(1, 0, 0),
    //     new Color(1, 1, 1),
    //     SIMULATION_ATTRIBUTES.targetDensity / this.density
    //   );
    // } else {
    //   return colorLerp(
    //     new Color(0, 0, 1),
    //     new Color(1, 1, 1),
    //     this.density / SIMULATION_ATTRIBUTES.targetDensity
    //   );
    // }
  }

  private checkCollisions() {
    const position = new Vector3().add(this.mesh.position);
    const velocity = new Vector3().add(this.velocity);

    if (this.mesh.position.y < 0) {
      position.y = 0;
      velocity.y = -this.velocity.y * VELOCITY_DAMPEN_VALUE;
    } else if (this.mesh.position.y > PARTICLES_SPAWNER_ATTRIBUTES.height) {
      // position.y = PARTICLES_SPAWNER_ATTRIBUTES.height;
      velocity.y = -this.velocity.y * VELOCITY_DAMPEN_VALUE;
    }

    if (Math.abs(this.mesh.position.x) > PARTICLES_SPAWNER_ATTRIBUTES.width) {
      // position.x =
      //   this.mesh.position.x > PARTICLES_SPAWNER_ATTRIBUTES.width
      //     ? PARTICLES_SPAWNER_ATTRIBUTES.width
      //     : -PARTICLES_SPAWNER_ATTRIBUTES.width;

      velocity.x = -this.velocity.x * VELOCITY_DAMPEN_VALUE;
    }

    if (Math.abs(this.mesh.position.z) > PARTICLES_SPAWNER_ATTRIBUTES.depth) {
      // position.z =
      //   this.mesh.position.z > PARTICLES_SPAWNER_ATTRIBUTES.depth
      //     ? PARTICLES_SPAWNER_ATTRIBUTES.depth
      //     : -PARTICLES_SPAWNER_ATTRIBUTES.depth;

      velocity.z = -this.velocity.z * VELOCITY_DAMPEN_VALUE;
    }

    this.mesh.position.set(position.x, position.y, position.z);
    this.velocity.set(velocity.x, velocity.y, velocity.z);
  }

  public get position() {
    return this.mesh.position;
  }
}
