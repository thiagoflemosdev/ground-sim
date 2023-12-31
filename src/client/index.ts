import {
  PARTICLES_SPAWNER_ATTRIBUTES,
  SIMULATION_ATTRIBUTES,
} from "./config/constants";
import { AssetsController } from "./controllers/AssetsController";
import { GroundSimulation } from "./world/GroundSimulation";

async function init() {
  await AssetsController.init();

  const world = new GroundSimulation();

  document.getElementById("reset")?.addEventListener("click", (e: Event) => {
    world.clearParticles();
    world.drawParticles();
  });

  document.getElementById("quantity")?.addEventListener("input", (e: Event) => {
    //@ts-ignore
    PARTICLES_SPAWNER_ATTRIBUTES.quantity = e.target?.value;
  });

  document.getElementById("width")?.addEventListener("input", (e: Event) => {
    //@ts-ignore
    PARTICLES_SPAWNER_ATTRIBUTES.width = e.target?.value;
  });

  document.getElementById("depth")?.addEventListener("input", (e: Event) => {
    //@ts-ignore
    PARTICLES_SPAWNER_ATTRIBUTES.depth = e.target?.value;
  });

  document.getElementById("height")?.addEventListener("input", (e: Event) => {
    //@ts-ignore
    PARTICLES_SPAWNER_ATTRIBUTES.height = e.target?.value;
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

  document
    .getElementById("pressureMultiplier")
    ?.addEventListener("input", (e: Event) => {
      //@ts-ignore
      SIMULATION_ATTRIBUTES.pressureMultiplier = e.target?.value / 10000;
    });

  world.init();
  world.drawParticles();
}

init();
