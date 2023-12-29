import { Vector3 } from 'three'

export const VOXEL_CUBE_TRIANGLES_FACE_LENGTH = 18

export const VOXEL_CUBE_TRIANGLES = [
    //FRONT
    0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0,
    //BACK
    0, 0, -1, 0, 1, -1, 1, 1, -1, 1, 1, -1, 1, 0, -1, 0, 0, -1,
    //TOP
    0, 1, 0, 1, 1, 0, 1, 1, -1, 1, 1, -1, 0, 1, -1, 0, 1, 0,
    //BOTTOM
    0, 0, 0, 0, 0, -1, 1, 0, -1, 1, 0, -1, 1, 0, 0, 0, 0, 0,
    //LEFT
    0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, -1, 0, 0, -1,
    //RIGHT
    1, 0, 0, 1, 0, -1, 1, 1, -1, 1, 1, -1, 1, 1, 0, 1, 0, 0,
]

export const VOCEL_CUBE_FACE_UVS = [0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0]

export const VOXEL_CUBE_FACE_NORMALS = [
    new Vector3(0, 0, 1),
    new Vector3(0, 0, -1),
    new Vector3(0, 1, 0),
    new Vector3(0, -1, 0),
    new Vector3(-1, 0, 0),
    new Vector3(1, 0, 0),
]
