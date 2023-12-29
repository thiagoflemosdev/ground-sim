import { AssetsController } from "./controllers/AssetsController";
import { GroundSimulation } from "./world/GroundSimulation";
import { NOISE_CONFIG } from "./config/constants";

async function init() {
  await AssetsController.init();

  const world = new GroundSimulation();

  document
    .getElementById("threshold")
    ?.addEventListener("input", (e: Event) => {
      //@ts-ignore
      NOISE_CONFIG.threshold = e.target?.value;
      world.clearChunks();
      world.drawChunks();
    });

  document.getElementById("scale")?.addEventListener("input", (e: Event) => {
    //@ts-ignore
    NOISE_CONFIG.scale = e.target?.value;
    world.clearChunks();
    world.drawChunks();
  });

  world.drawChunks();
}

init();
