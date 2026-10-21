import { clamp, lerp, type Point, smooth } from './math'

export type Camera = { x: number; y: number; z: number }

export type CameraKey = { x: number; y: number; w: number; h: number }

// The world box each beat frames: the home, Ginger's room, the home with Paula's phone, the home again.
export const KEYS: readonly CameraKey[] = [
  { h: 260, w: 376, x: 201, y: 180 },
  { h: 156.52173913043478, w: 174.7826086956522, x: 230, y: 180 },
  { h: 370, w: 470, x: 295, y: 105 },
  { h: 260, w: 376, x: 201, y: 180 },
]

export type KeyValues = readonly [number, number, number, number]

const camAt = (k: CameraKey, sw: number, sh: number): Camera => ({ x: k.x, y: k.y, z: Math.min(sw / k.w, sh / k.h) })

export const keyLerp = (q: number, keys: KeyValues) => {
  const i = Math.min(2, Math.max(0, Math.floor(q)))
  return lerp(keys[i] ?? 0, keys[i + 1] ?? 0, smooth(clamp(q - i)))
}

const keyAt = (i: number): CameraKey => KEYS[i] ?? (KEYS[0] as CameraKey)

// Zooms geometrically and pans so the screen point under the camera moves at an even pace.
export const camera = (q: number, sw: number, sh: number, keyInsets?: KeyValues, keyShift?: KeyValues): Camera => {
  const i = Math.min(2, Math.max(0, Math.floor(q)))
  const f = clamp(q - i)
  const e = keyInsets ? keyLerp(q, keyInsets) : 0
  const s = keyShift ? keyLerp(q, keyShift) : 0
  const h = sh - e
  const a = camAt(keyAt(i), sw, h)
  const b = camAt(keyAt(i + 1), sw, h)
  const z = a.z * (b.z / a.z) ** f
  const g = Math.abs(b.z - a.z) < 1e-6 ? f : (1 / a.z - 1 / z) / (1 / a.z - 1 / b.z)
  return { x: lerp(a.x, b.x, g), y: lerp(a.y, b.y, g) + e / (2 * z) - s / z, z }
}

export const w2s = (pt: Point, cam: Camera, sw: number, sh: number): Point => [
  sw / 2 + (pt[0] - cam.x) * cam.z,
  sh / 2 + (pt[1] - cam.y) * cam.z,
]

export const cameraMatrix = (cam: Camera, sw: number, sh: number) =>
  [cam.z, 0, 0, cam.z, sw / 2 - cam.x * cam.z, sh / 2 - cam.y * cam.z] as const
