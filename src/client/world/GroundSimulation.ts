import {
  BufferGeometry,
  Float32BufferAttribute,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from "three";
import {
  CHUNK_SIZE,
  WORLD_H_DRAW_DISTANCE,
  WORLD_V_DRAW_DISTANCE,
} from "../config/constants";
import { Chunk } from "./Chunk";
import { World } from "./World";
import { AssetsController } from "../controllers/AssetsController";

export class GroundSimulation extends World {
  private chunkMeshList: Mesh[] = [];
  private chunkMaterial: MeshStandardMaterial;

  constructor() {
    super();

    this.chunkMaterial = new MeshStandardMaterial({
      color: 0xffffff,
      map: AssetsController.grassTexture,
      vertexColors: true,
    });
  }

  public clearChunks() {
    this.chunkMeshList.forEach((mesh) => {
      mesh.geometry.dispose();
      this.scene.remove(mesh);
    });

    this.chunkMeshList.splice(0, this.chunkMeshList.length);
  }

  public drawChunks() {
    for (let x = -WORLD_H_DRAW_DISTANCE; x < WORLD_H_DRAW_DISTANCE; x++) {
      for (let y = 0; y < WORLD_V_DRAW_DISTANCE; y++) {
        for (let z = -WORLD_H_DRAW_DISTANCE; z < WORLD_H_DRAW_DISTANCE; z++) {
          this.addChunk(new Vector3(x, y, z));
        }
      }
    }
  }

  private addChunk(index: Vector3) {
    const chunk = new Chunk(index).calculate();

    if (chunk.triangles.length) {
      const geometry = new BufferGeometry();

      geometry.setAttribute(
        "position",
        new Float32BufferAttribute(chunk.triangles, 3)
      );
      geometry.setAttribute("uv", new Float32BufferAttribute(chunk.uv, 2));
      geometry.setAttribute(
        "color",
        new Float32BufferAttribute(chunk.colors, 3)
      );

      geometry.computeVertexNormals();

      const mesh = new Mesh(geometry, this.chunkMaterial);
      mesh.position.x = index.x * CHUNK_SIZE;
      mesh.position.y = index.y * CHUNK_SIZE;
      mesh.position.z = index.z * CHUNK_SIZE;

      // mesh.castShadow = true
      // mesh.receiveShadow = true

      this.scene.add(mesh);

      this.chunkMeshList.push(mesh);
    }
  }
}
