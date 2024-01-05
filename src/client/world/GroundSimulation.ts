import {
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Raycaster,
  Vector2,
  Vector3,
} from "three";
import {
  MIN_DENSITY,
  PARTICLES_SPAWNER_ATTRIBUTES,
  PARTICLE_RADIUS,
  SIMULATION_ATTRIBUTES,
} from "../config/constants";
import { randomRange } from "../utils/math";
import { Particle } from "./Particle";
import { World } from "./World";

export enum ForceMode {
  Disabled,
  Push,
  Pull,
}

export class GroundSimulation extends World {
  private particlesList: Particle[] = [];
  private map: Record<string, Particle[]> = {};
  private raycaster = new Raycaster();
  public cursor = new Vector2();
  public forceMode = ForceMode.Disabled;

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
            -PARTICLES_SPAWNER_ATTRIBUTES.width,
            PARTICLES_SPAWNER_ATTRIBUTES.width
          ),
          randomRange(0, PARTICLES_SPAWNER_ATTRIBUTES.height),
          randomRange(
            -PARTICLES_SPAWNER_ATTRIBUTES.depth,
            PARTICLES_SPAWNER_ATTRIBUTES.depth
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
    this.map = {};
    super.update();

    this.particlesList.forEach((element, i) => {
      element.calculatePredictedPosition();
      element.calculateIndex(i);

      if (this.map[element.sortIndex]) {
        this.map[element.sortIndex].push(element);
      } else {
        this.map[element.sortIndex] = [element];
      }
    });

    this.calculateDensities();

    this.applyPressureToAllParticles();

    if (this.forceMode !== ForceMode.Disabled) {
      this.applyForce();
    }

    this.particlesList.forEach((element) => {
      element.update();
    });
  }

  private calculateDensities() {
    this.particlesList.forEach((particle) => {
      let d = MIN_DENSITY;

      this.particlesNeighborhoodLoop(particle, (v) => {
        const dst = particle.predictedPosition.distanceTo(v.predictedPosition);

        d += this.getInfluenceValue(dst);
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

    this.particlesNeighborhoodLoop(particle, (v) => {
      this.applyPressureLoop(
        pressure,
        particle,
        v.predictedPosition,
        v.density
      );
    });

    return pressure;
  }

  private applyPressureLoop(
    pressure: Vector3,
    particle: Particle,
    position: Vector3,
    density: number
  ) {
    const dst = position.distanceTo(particle.predictedPosition);

    const dir =
      dst == 0
        ? new Vector3(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
          )
        : new Vector3()
            .add(position)
            .sub(particle.predictedPosition)
            .divideScalar(dst);

    const slope = this.getInfluenceValueSlope(dst);

    const pressureValue = this.calculateSharedPressure(
      density,
      particle.density
    );

    pressure.add(
      new Vector3()
        .addScalar(pressureValue)
        .multiply(dir)
        .multiplyScalar(slope)
        .divideScalar(particle.density)
    );
  }

  private calculateSharedPressure(densityA: number, densityB: number) {
    const pressureValueA =
      Math.abs(densityA - SIMULATION_ATTRIBUTES.targetDensity) *
      SIMULATION_ATTRIBUTES.pressureMultiplier;

    const pressureValueB =
      Math.abs(densityB - SIMULATION_ATTRIBUTES.targetDensity) *
      SIMULATION_ATTRIBUTES.pressureMultiplier;

    return (pressureValueA + pressureValueB) / 2;
  }

  private particlesNeighborhoodLoop(ref: Particle, cp: (p: Particle) => void) {
    const pos = ref.sortIndex.split("|").map((v) => Number(v));

    const distance = 1;

    for (let x = pos[0] - distance; x <= pos[0] + distance; x++) {
      for (let y = pos[1] - distance; y <= pos[1] + distance; y++) {
        for (let z = pos[2] - distance; z <= pos[2] + distance; z++) {
          const index = `${x}|${y}|${z}`;

          if (this.map[index]) {
            this.map[index].forEach((p) => {
              if (ref.index !== p.index) {
                cp(p);
              }
            });
          }
        }
      }
    }

    // this.particlesList.forEach((p) => {
    //   if (ref.index !== p.index) {
    //     cp(p);
    //   }
    // });
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

  private applyForce() {
    this.raycaster.setFromCamera(this.cursor, this.camera);

    const intersects = this.raycaster.intersectObjects(this.scene.children);

    if (intersects.length) {
      const p = intersects[0].point;

      this.particlesList.forEach((v) => {
        const dst = p.distanceTo(v.position);

        if (dst <= SIMULATION_ATTRIBUTES.forceRadius) {
          if (this.forceMode == ForceMode.Push) {
            v.force = new Vector3()
              .add(v.position)
              .sub(p)
              .multiplyScalar((dst / SIMULATION_ATTRIBUTES.forceRadius) * 0.01);
          } else if (this.forceMode == ForceMode.Pull) {
            v.force = new Vector3()
              .add(v.position)
              .sub(p)
              .multiplyScalar(
                (dst / SIMULATION_ATTRIBUTES.forceRadius) * -0.005
              );
          }
        }
      });
    }
  }
}
