import { Mesh, MeshStandardMaterial, PlaneGeometry, Vector3 } from "three";
import {
  MIN_DENSITY,
  PARTICLES_SPAWNER_ATTRIBUTES,
  PARTICLE_RADIUS,
  SIMULATION_ATTRIBUTES,
} from "../config/constants";
import { randomRange } from "../utils/math";
import { Particle } from "./Particle";
import { World } from "./World";

export class GroundSimulation extends World {
  private particlesList: Particle[] = [];

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
    for (let x = 0; x < PARTICLES_SPAWNER_ATTRIBUTES.quantity; x++) {
      // cos(angle)*radius;
      // sin(angle)*radius;

      this.addParticle(
        new Vector3(
          randomRange(
            -PARTICLES_SPAWNER_ATTRIBUTES.range,
            PARTICLES_SPAWNER_ATTRIBUTES.range
          ),
          randomRange(0, PARTICLES_SPAWNER_ATTRIBUTES.range),
          randomRange(
            -PARTICLES_SPAWNER_ATTRIBUTES.range,
            PARTICLES_SPAWNER_ATTRIBUTES.range
          )
        )
      );
    }
  }

  private addParticle(position: Vector3) {
    const particle = new Particle(position);
    this.scene.add(particle.mesh);
    this.particlesList.push(particle);
  }

  protected update() {
    super.update();

    this.calculateDensities();

    this.applyPressureToAllParticles();

    this.particlesList.forEach((element) => {
      element.update();
    });
  }

  private calculateDensities() {
    this.particlesList.forEach((particle, i) => {
      let d = MIN_DENSITY;
      this.particlesList.forEach((v, i2) => {
        if (i != i2) {
          const dst = particle.mesh.position.distanceTo(v.mesh.position);

          d += this.getInfluenceValue(dst);
        }
      });

      particle.density = d;
    });
  }

  private applyPressureToAllParticles() {
    this.particlesList.forEach((particle, i) => {
      particle.velocity.add(
        this.calculateParticlePressure(i).divideScalar(particle.density)
      );
    });
  }

  private calculateParticlePressure(index: number) {
    const particle = this.particlesList[index];
    let pressure = new Vector3();

    this.particlesList.forEach((v, i) => {
      if (index != i) {
        const dst = v.mesh.position.distanceTo(particle.mesh.position);

        const dir = new Vector3()
          .add(v.mesh.position)
          .sub(particle.mesh.position)
          .divideScalar(dst);

        const slope = this.getInfluenceValueSlope(dst);

        const pressureValue =
          Math.abs(particle.density - SIMULATION_ATTRIBUTES.targetDensity) *
          SIMULATION_ATTRIBUTES.pressureMultiplier;

        pressure.add(
          new Vector3()
            .addScalar(pressureValue)
            .multiply(dir)
            .multiplyScalar(slope)
            .divideScalar(particle.density)
        );
      }
    });

    return pressure;
  }

  private getInfluenceValue(dst: number) {
    const radius = SIMULATION_ATTRIBUTES.influenceRadius;

    if (dst < radius) {
      const scale = 15 / (2 * Math.PI * Math.pow(radius, 5));
      const v = radius - dst;
      return v * v * scale;
    }

    return 0;
  }

  private getInfluenceValueSlope(dst: number) {
    const radius = SIMULATION_ATTRIBUTES.influenceRadius;

    if (dst <= radius) {
      const scale = 15 / (Math.pow(radius, 5) * Math.PI);
      const v = radius - dst;
      return -v * scale;
    }
    return 0;
  }
}
