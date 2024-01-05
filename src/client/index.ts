import { AssetsController } from "./controllers/AssetsController";
import { DebugController } from "./controllers/DebugController";
import { ForceMode, GroundSimulation } from "./world/GroundSimulation";

async function init() {
  await AssetsController.init();

  const world = new GroundSimulation();

  DebugController.init(world);

  world.init();
  world.drawParticles();

  window.addEventListener("keydown", (e) => {
    console.log(e.code);
    if (e.code == "MetaRight" || e.code == "ControlLeft") {
      world.forceMode = ForceMode.Push;
    } else if (e.code == "ShiftLeft") {
      world.forceMode = ForceMode.Pull;
    }
  });

  window.addEventListener("keyup", (e) => {
    if (
      e.code == "MetaRight" ||
      e.code == "ControlLeft" ||
      e.code == "ShiftLeft"
    ) {
      world.forceMode = ForceMode.Disabled;
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
