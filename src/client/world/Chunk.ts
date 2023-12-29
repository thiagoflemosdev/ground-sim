import { Vector3 } from "three";
import {
  CHUNK_SIZE,
  TILE_OFFSET,
  WORLD_GROUND_LEVEL,
} from "../config/constants";
import {
  VOCEL_CUBE_FACE_UVS,
  VOXEL_CUBE_FACE_NORMALS,
  VOXEL_CUBE_TRIANGLES,
  VOXEL_CUBE_TRIANGLES_FACE_LENGTH,
} from "../config/voxel";
import { lerp } from "../utils/math";
import { noise2D } from "../utils/noise";

export class Chunk {
  public readonly triangles: number[] = [];
  public readonly uv: number[] = [];
  public readonly colors: number[] = [];

  private globalIndex: Vector3;

  constructor(index: Vector3) {
    this.globalIndex = new Vector3(
      index.x * CHUNK_SIZE,
      index.y * CHUNK_SIZE,
      index.z * CHUNK_SIZE
    );
  }

  public calculate() {
    for (let x = 0; x < CHUNK_SIZE; x++) {
      for (let z = 0; z < CHUNK_SIZE; z++) {
        const index = new Vector3(x, 1, z);
        this.drawCube(index);
      }
    }

    return this;
  }

  private drawCube(index: Vector3) {
    VOXEL_CUBE_FACE_NORMALS.forEach((v, i) =>
      this.drawFace(
        new Vector3(
          index.x + index.x * TILE_OFFSET,
          index.y + index.y * TILE_OFFSET,
          index.z + index.z * TILE_OFFSET
        ),
        i
      )
    );
  }

  private drawFace(index: Vector3, faceIndex: number) {
    const faceOffset = faceIndex * VOXEL_CUBE_TRIANGLES_FACE_LENGTH;
    const heightValue = noise2D(index.x, index.z);

    for (let i = 0; i < VOXEL_CUBE_TRIANGLES_FACE_LENGTH / 3; i++) {
      const vectorOffset = i * 3;
      const uvsOffset = i * 2;
      this.triangles.push(
        index.x + VOXEL_CUBE_TRIANGLES[faceOffset + vectorOffset]
      );
      this.triangles.push(
        index.y + VOXEL_CUBE_TRIANGLES[faceOffset + vectorOffset + 1]
      );
      this.triangles.push(
        index.z + VOXEL_CUBE_TRIANGLES[faceOffset + vectorOffset + 2]
      );
      this.uv.push(VOCEL_CUBE_FACE_UVS[uvsOffset]);
      this.uv.push(VOCEL_CUBE_FACE_UVS[uvsOffset + 1]);

      if (this.globalIndex.y + index.y > 12) {
        this.colors.push(lerp(0, 1, heightValue), 0, 0);
      } else {
        this.colors.push(1, 1, 1);
      }
    }
  }
}
