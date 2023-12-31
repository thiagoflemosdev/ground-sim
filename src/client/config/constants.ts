import { Vector3 } from "three";

export const PARTICLES_SPAWNER_ATTRIBUTES = {
  quantity: 200,
  range: 10,
};

export const SIMULATION_ATTRIBUTES = {
  influenceRadius: 1,
  targetDensity: 0.2,
};

export const VELOCITY_DAMPEN_VALUE = 0.7;
// export const GRAVITY_VALUE = new Vector3(0, -0.002, 0);
export const GRAVITY_VALUE = new Vector3(0, 0, 0);
export const PARTICLE_RADIUS = 0.5;

export const MIN_DENSITY = 0.1;
