import {
  PARTICLES_SPAWNER_ATTRIBUTES,
  SIMULATION_ATTRIBUTES,
} from "./config/constants";
import { AssetsController } from "./controllers/AssetsController";
import { GroundSimulation } from "./world/GroundSimulation";

async function init() {
  await AssetsController.init();

  const world = new GroundSimulation();

  document.getElementById("quantity")?.addEventListener("input", (e: Event) => {
    //@ts-ignore
    PARTICLES_SPAWNER_ATTRIBUTES.quantity = e.target?.value;

    world.clearParticles();
    world.drawParticles();
  });

  document.getElementById("range")?.addEventListener("input", (e: Event) => {
    //@ts-ignore
    PARTICLES_SPAWNER_ATTRIBUTES.range = e.target?.value;

    world.clearParticles();
    world.drawParticles();
  });

  document
    .getElementById("influenceRadius")
    ?.addEventListener("input", (e: Event) => {
      //@ts-ignore
      SIMULATION_ATTRIBUTES.influenceRadius = e.target?.value;
    });

  document
    .getElementById("targetDensity")
    ?.addEventListener("input", (e: Event) => {
      //@ts-ignore
      SIMULATION_ATTRIBUTES.targetDensity = e.target?.value / 100;
    });

  world.init();
  world.drawParticles();
}

init();
