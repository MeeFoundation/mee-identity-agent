import { qOf } from './drivers'
import { clamp, lerp } from './math'
import {
  BACK_STORY_LEG_MS,
  CAM_BEZIER,
  CAM_MAX_MS,
  CAM_MIN_MS,
  CAM_MS,
  CAM_MS_PER_BEAT,
  FLING_PROJECT_S,
  PRESS_MIN_MS,
  PRESS_WINDOWS_M2,
  RUBBER_MAX,
  RUBBER_RESIST,
  STORY_LEG_MAX,
  STORY_LEG_MIN,
  STORY_LEG_MS_FULL,
  T2,
} from './timeline'

const EPS = 1e-4

const cubicBezier = (x1: number, y1: number, x2: number, y2: number, t: number) => {
  if (t <= 0) return 0
  if (t >= 1) return 1
  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx
  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by
  let s = t
  for (let i = 0; i < 8; i++) {
    const x = ((ax * s + bx) * s + cx) * s - t
    const d = (3 * ax * s + 2 * bx) * s + cx
    if (Math.abs(x) < 1e-6) break
    if (Math.abs(d) < 1e-6) break
    s -= x / d
  }
  let x = ((ax * s + bx) * s + cx) * s
  if (Math.abs(x - t) > 1e-5 || s < 0 || s > 1) {
    let lo = 0
    let hi = 1
    s = t
    for (let i = 0; i < 30; i++) {
      x = ((ax * s + bx) * s + cx) * s
      if (Math.abs(x - t) < 1e-6) break
      if (x < t) lo = s
      else hi = s
      s = (lo + hi) / 2
    }
  }
  return ((ay * s + by) * s + cy) * s
}

export const easeCam = (t: number) => cubicBezier(CAM_BEZIER[0], CAM_BEZIER[1], CAM_BEZIER[2], CAM_BEZIER[3], t)

const pOfQ = (q: number, se: number, high: boolean) => {
  if (!high || q <= 1) return high ? se : q
  if (q <= 2) return se + (q - 1) * (2 - se)
  return q
}

export const dqdp = (p: number, se: number) => {
  if (p <= 1 || p > 2) return 1
  if (p < se) return 0
  return 1 / Math.max(1e-6, 2 - se)
}

const camMs = (dq: number, retarget: boolean) => {
  if (!retarget && Math.abs(Math.abs(dq) - 1) < 0.02) return CAM_MS
  return Math.min(CAM_MAX_MS, Math.max(CAM_MIN_MS, CAM_MS_PER_BEAT * Math.abs(dq)))
}

const storyFwdMs = (t2From: number) => clamp(STORY_LEG_MS_FULL * (1 - t2From), STORY_LEG_MIN, STORY_LEG_MAX)

// A camera leg eases `q`; a story leg plays beat 2's story linearly, slowed through the press windows (`warp`).
export type Leg = {
  kind: 0 | 1
  p0: number
  p1: number
  ms: number
  se: number
  warp: readonly number[]
}

const camLeg = (p0: number, p1: number, se: number, retarget: boolean): Leg => {
  const dq = qOf(p1, se) - qOf(p0, se)
  return { kind: 0, ms: camMs(dq, retarget), p0, p1, se, warp: [] }
}

const m2At = (p: number, se: number, t2From: number) => {
  const span = Math.max(EPS, se - 1)
  return T2 * (t2From + (1 - t2From) * clamp((p - 1) / span))
}

const storyLeg = (p0: number, p1: number, se: number, t2From: number, retarget: boolean): Leg => {
  const span = Math.max(EPS, se - 1)
  const frac = Math.abs(p1 - p0) / span
  const k = retarget ? 0.5 : 1
  if (p1 <= p0) return { kind: 1, ms: BACK_STORY_LEG_MS * frac * k, p0, p1, se, warp: [] }
  const base = storyFwdMs(t2From) * frac * k
  const ma = m2At(p0, se, t2From)
  const mb = m2At(p1, se, t2From)
  const S = mb - ma
  if (S < 1e-6) return { kind: 1, ms: base, p0, p1, se, warp: [] }
  const rate = base / S
  const cuts = [ma]
  for (const c of PRESS_WINDOWS_M2) if (c > ma + 1e-6 && c < mb - 1e-6) cuts.push(c)
  cuts.push(mb)
  const times = [0]
  let total = 0
  for (let i = 1; i < cuts.length; i++) {
    const a = cuts[i - 1] ?? 0
    const b = cuts[i] ?? 0
    const mid = (a + b) / 2
    let inPress = false
    for (let w = 0; w + 1 < PRESS_WINDOWS_M2.length; w += 2) {
      if (mid > (PRESS_WINDOWS_M2[w] ?? 0) && mid < (PRESS_WINDOWS_M2[w + 1] ?? 0)) inPress = true
    }
    const r = inPress ? Math.max(rate, PRESS_MIN_MS / (PRESS_WINDOWS_M2[1] - PRESS_WINDOWS_M2[0])) : rate
    total += (b - a) * r
    times.push(total)
  }
  if (cuts.length <= 2 || total < 1e-6) return { kind: 1, ms: base, p0, p1, se, warp: [] }
  const warp: number[] = []
  for (let i = 0; i < cuts.length; i++) warp.push((times[i] ?? 0) / total, ((cuts[i] ?? 0) - ma) / S)
  return { kind: 1, ms: total, p0, p1, se, warp }
}

const warpAt = (w: readonly number[], t: number) => {
  const x = clamp(t)
  if (w.length < 4) return x
  for (let i = 2; i < w.length; i += 2) {
    if (x <= (w[i] ?? 0) || i === w.length - 2) {
      const t0 = w[i - 2] ?? 0
      const dt = (w[i] ?? 0) - t0
      return dt < 1e-9 ? (w[i + 1] ?? 0) : lerp(w[i - 1] ?? 0, w[i + 1] ?? 0, clamp((x - t0) / dt))
    }
  }
  return x
}

// Splits a move from `p` to beat `T` into legs, playing beat 2's story between the camera moves when it is crossed.
export const planMove = (p: number, T: number, se: number, t2From: number, retarget: boolean): Leg[] => {
  const legs: Leg[] = []
  if (Math.abs(T - p) < EPS) return legs
  if (se <= 1 + EPS) {
    legs.push(camLeg(p, T, se, retarget))
    return legs
  }
  let x = p
  if (T > p) {
    if (x < 1 - EPS) {
      const to = Math.min(T, 1)
      legs.push(camLeg(x, to, se, retarget))
      x = to
    }
    if (T >= 2) {
      if (x < se - EPS) {
        const from = Math.max(x, 1)
        legs.push(storyLeg(from, se, se, t2From, retarget))
        x = se
      }
      if (x < T - EPS) legs.push(camLeg(x, T, se, retarget))
    }
  } else if (T >= 2) {
    legs.push(camLeg(x, T, se, retarget))
  } else {
    if (x > se + EPS) {
      legs.push(camLeg(x, se, se, retarget))
      x = se
    }
    if (x > 1 + EPS) {
      legs.push(storyLeg(x, 1, se, t2From, retarget))
      x = 1
    }
    if (x > T + EPS) legs.push(camLeg(x, T, se, retarget))
  }
  return legs
}

const legP = (leg: Leg, t: number) => {
  if (leg.kind === 1) return lerp(leg.p0, leg.p1, warpAt(leg.warp, t))
  const se = leg.se
  const high = se > 1 + EPS && Math.min(leg.p0, leg.p1) >= se - EPS
  const q0 = qOf(leg.p0, se)
  const q1 = qOf(leg.p1, se)
  const q = lerp(q0, q1, easeCam(clamp(t)))
  return se > 1 + EPS ? pOfQ(q, se, high) : q
}

// The leg's progress as an easing value, for a timing animation from `p0` to `p1`.
export const legProgress = (leg: Leg, t: number) => {
  const d = leg.p1 - leg.p0
  if (Math.abs(d) < 1e-9) return t
  return (legP(leg, t) - leg.p0) / d
}

export const rubber = (raw: number) => {
  if (raw < 0) return -Math.min(RUBBER_MAX, -raw * RUBBER_RESIST)
  if (raw > 3) return 3 + Math.min(RUBBER_MAX, (raw - 3) * RUBBER_RESIST)
  return raw
}

// The beat a released drag settles on: the projected position, at most one beat from where the drag started.
export const panTarget = (startBeat: number, q: number, vq: number) => {
  const qEnd = q + vq * FLING_PROJECT_S
  const lo = Math.max(0, startBeat - 1)
  const hi = Math.min(3, startBeat + 1)
  return Math.min(hi, Math.max(lo, Math.round(qEnd)))
}
