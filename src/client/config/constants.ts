import { Vector3 } from "three";

export const PARTICLES_SPAWNER_ATTRIBUTES = {
  quantity: 130,
  width: 10,
  depth: 10,
  height: 1,
};

export const SIMULATION_ATTRIBUTES = {
  influenceRadius: 1,
  targetDensity: 0.2,
  pressureMultiplier: 0.01,
  dragMultiplier: new Vector3(1, 1, 1),
  // dragMultiplier: new Vector3(0.9, 1, 0.9),
};

export const VELOCITY_DAMPEN_VALUE = 0.7;
export const GRAVITY_VALUE = new Vector3(0, -0.002, 0);
// export const GRAVITY_VALUE = new Vector3(0, 0, 0);
export const PARTICLE_RADIUS = 0.5;

export const MIN_DENSITY = 0.1;
