import { Vector3 } from "three";

export const PARTICLES_SPAWNER = {
  width: 10,
  depth: 10,
  height: 1,
  spacing: 0,
  elevation: 5,
};

export const VELOCITY_DAMPEN_VALUE = 0.7;
export const GRAVITY_VALUE = new Vector3(0, -0.002, 0);
export const PARTICLE_RADIUS = 0.5;
