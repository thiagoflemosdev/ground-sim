import { Vector3 } from "three";
import { AssetsController } from "./controllers/AssetsController";
import { GroundSimulation } from "./world/GroundSimulation";

async function init() {
  await AssetsController.init();

  const world = new GroundSimulation();

  document
    .getElementById("positionx")
    ?.addEventListener("input", (e: Event) => {
      world.clearChunks();
      //@ts-ignore
      world.drawChunks();
    });

  world.drawChunks();
}

init();
