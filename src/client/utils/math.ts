import { Color } from 'three'

export function lerp(start: number, end: number, value: number) {
    return start + (end - start) * value
}

export function colorLerp(start: Color, end: Color, value: number) {
    return new Color(
        lerp(start.r, end.r, value),
        lerp(start.g, end.g, value),
        lerp(start.b, end.b, value)
    )
}
