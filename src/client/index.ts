import { AssetsController } from "./controllers/AssetsController";
import { GroundSimulation } from "./world/GroundSimulation";

async function init() {
  await AssetsController.init();

  const world = new GroundSimulation();

  document
    .getElementById("placeholder")
    ?.addEventListener("input", (e: Event) => {
      //@ts-ignore
      // NOISE_CONFIG.threshold = e.target?.value;
      world.clearParticles();
      world.drawParticles();
    });

  world.init();
  world.drawParticles();
}

init();
