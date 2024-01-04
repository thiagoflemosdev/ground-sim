import { RepeatWrapping, Texture, TextureLoader } from "three";
import { GroundSimulation } from "../world/GroundSimulation";
import { PARTICLES_SPAWNER_ATTRIBUTES } from "../config/constants";

export class DebugController {
  public static init(world: GroundSimulation) {
    document.getElementById("reset")?.addEventListener("click", (e: Event) => {
      world.clearParticles();
      world.drawParticles();
    });

    document
      .getElementById("quantity")
      ?.addEventListener("input", (e: Event) => {
        //@ts-ignore
        PARTICLES_SPAWNER_ATTRIBUTES.quantity = e.target?.value;

        console.log(PARTICLES_SPAWNER_ATTRIBUTES.quantity);
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
  }
}
