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
      world.drawChunks(new Vector3(Number(e.target?.value), 0, 0));
    });

  world.drawChunks(new Vector3(0, 0, 0));
}

init();
