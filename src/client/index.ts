import { AssetsController } from "./controllers/AssetsController";
import { DebugController } from "./controllers/DebugController";
import { GroundSimulation } from "./world/GroundSimulation";

async function init() {
  await AssetsController.init();

  const world = new GroundSimulation();

  DebugController.init(world);

  world.init();
  world.drawParticles();

  window.addEventListener("keydown", (e) => {
    if (e.code == "MetaRight" || e.code == "ControlLeft") {
      world.forceEnabled = true;
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.code == "MetaRight" || e.code == "ControlLeft") {
      world.forceEnabled = false;
    }
  });

  window.addEventListener("pointermove", (e) => {
    const PANEL_SIZE = 130;

    const width = window.innerWidth;
    const height = window.innerHeight - PANEL_SIZE;

    world.cursor.set(
      (e.clientX / width) * 2 - 1,
      -((e.clientY - PANEL_SIZE) / height) * 2 + 1
    );
  });
}

init();
