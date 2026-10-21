// Ported from the "Tellipod Intro" prototype's math module; names are kept to compare with the source.

export type Point = readonly [number, number]

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))

export const remap = (x: number, a: number, b: number) => {
  if (Math.abs(b - a) < 1e-9) return x >= a ? 1 : 0
  return clamp((x - a) / (b - a))
}

// Progress of a time `ms` through the window `a`..`b`.
export const ph = (ms: number, a: number, b: number) => remap(ms, a, b)

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const smooth = (t: number) => t * t * (3 - 2 * t)

export const eio = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

export const eo = (t: number) => 1 - (1 - t) ** 3

export const interp = (x: number, xs: readonly number[], ys: readonly number[]) => {
  if (x <= (xs[0] ?? 0)) return ys[0] ?? 0
  for (let i = 1; i < xs.length; i++) {
    if (x <= (xs[i] ?? 0)) return lerp(ys[i - 1] ?? 0, ys[i] ?? 0, remap(x, xs[i - 1] ?? 0, xs[i] ?? 0))
  }
  return ys[ys.length - 1] ?? 0
}

export const pulse = (t: number) => Math.sin(Math.PI * clamp(t))

const S3 = 0.8660254

// Isometric projection of world `u`, `v` (floor) and `z` (height) into scene coordinates.
export const iso = (u: number, v: number, z = 0): Point => [201 + S3 * (u - v), 196 + 0.5 * (u + v) - z]

export const bezierQ = (p0: Point, c: Point, p2: Point, t: number): Point => {
  const u = 1 - t
  return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p2[1]]
}

// The first part of a quadratic curve, up to `t`, as a new curve.
export const splitQ = (p0: Point, c: Point, p2: Point, t: number): readonly [Point, Point, Point] => {
  const c1: Point = [lerp(p0[0], c[0], t), lerp(p0[1], c[1], t)]
  return [p0, c1, bezierQ(p0, c, p2, t)]
}

const hexToRgb = (h: string) => [
  Number.parseInt(h.slice(1, 3), 16),
  Number.parseInt(h.slice(3, 5), 16),
  Number.parseInt(h.slice(5, 7), 16),
]

export const lerpColor = (a: string, b: string, t: number) => {
  const x = hexToRgb(a)
  const y = hexToRgb(b)
  let out = '#'
  for (let i = 0; i < 3; i++) {
    const v = Math.round(lerp(x[i] ?? 0, y[i] ?? 0, clamp(t)))
    out += (v < 16 ? '0' : '') + v.toString(16)
  }
  return out
}
