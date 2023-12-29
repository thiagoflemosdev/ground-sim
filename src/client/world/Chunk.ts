import { Vector3 } from "three";
import { CHUNK_SIZE, WORLD_GROUND_LEVEL } from "../config/constants";
import {
  VOCEL_CUBE_FACE_UVS,
  VOXEL_CUBE_FACE_NORMALS,
  VOXEL_CUBE_TRIANGLES,
  VOXEL_CUBE_TRIANGLES_FACE_LENGTH,
} from "../config/voxel";
import { lerp } from "../utils/math";

export class Chunk {
  public readonly triangles: number[] = [];
  public readonly uv: number[] = [];
  public readonly colors: number[] = [];

  private globalIndex: Vector3;
  private heightMap: number[][] = [];

  constructor(index: Vector3, private x: number) {
    this.globalIndex = new Vector3(
      index.x * CHUNK_SIZE,
      index.y * CHUNK_SIZE,
      index.z * CHUNK_SIZE
    );
  }

  public dispose() {
    this.heightMap.splice(0, this.heightMap.length);
  }

  public calculate() {
    for (let x = -1; x < CHUNK_SIZE + 1; x++) {
      const row = [];
      for (let z = -1; z < CHUNK_SIZE + 1; z++) {
        row.push(Math.random() > 0.5 ? 3 : 4);
      }
      this.heightMap.push(row);
    }

    for (let x = 0; x < CHUNK_SIZE; x++) {
      for (let y = 0; y < CHUNK_SIZE; y++) {
        for (let z = 0; z < CHUNK_SIZE; z++) {
          const index = new Vector3(x, y, z);
          if (!this.isEmpty(index)) {
            this.drawCube(index);
          }
        }
      }
    }

    return this;
  }

  private drawCube(index: Vector3) {
    VOXEL_CUBE_FACE_NORMALS.forEach((v, i) => this.drawFace(index, i));
  }

  private drawFace(index: Vector3, faceIndex: number) {
    const faceOffset = faceIndex * VOXEL_CUBE_TRIANGLES_FACE_LENGTH;
    const normal = VOXEL_CUBE_FACE_NORMALS[faceIndex];
    const heightValue = this.getHeightValue(index);

    if (
      this.isEmpty(
        new Vector3(index.x + normal.x, index.y + normal.y, index.z + normal.z)
      )
    ) {
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

  private isEmpty(index: Vector3) {
    if (this.globalIndex.y + index.y <= WORLD_GROUND_LEVEL) {
      return false;
    }

    return this.globalIndex.y + index.y > this.getHeightValue(index);
  }

  private getHeightValue(index: Vector3) {
    return this.heightMap[index.x + 1][index.z + 1];
  }
}
