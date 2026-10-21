// Ported from the "Tellipod Intro" prototype's v2 geometry module: where the living-pod scene's cards, keys and rows sit
// in its 402×360 canvas, and how the deck of pods falls into place. Names are kept to compare with the source.

import { eio, eo, interp, lerp, type Point, ph, remap, smooth } from './math'
import type { Stage } from './values'

// v2's opening takes longer than v1's, because four cards fall one after another.
export const T1_V2 = 2440

export const CW = 402
export const CH = 360

type Frame = { x: number; y: number; w: number; h: number; r: number }

// The pod card on each beat: the deck's top card, the open pod, Paula's-phone-sized card and a list row.
export const P1: Frame = { h: 279, r: 28, w: 264, x: 69, y: 58 }
export const P2: Frame = { h: 326, r: 28, w: 312, x: 45, y: 8 }
export const P3: Frame = { h: 302, r: 24, w: 214, x: 14, y: 26 }
export const P4: Frame = { h: 60, r: 16, w: 330, x: 36, y: 60 }

export const BODY3_W = P3.w - 2
export const BODY3_H = P3.h - 2
// Paula's card is the same pod drawn at this scale, beside her avatar.
export const PAULA_K = 150 / P3.w
export const PAULA_CARD = { h: P3.h * PAULA_K, w: P3.w * PAULA_K, x: 240, y: 118 }
export const PAULA_AV = { cx: 240 + (P3.w * PAULA_K) / 2, cy: 46 }

// The pods list on beat 4.
export const ROW_X = 36
const ROW_H = 60
export const ROW_Y = [60, 128, 196, 264] as const
export const ROW_FADE = [1, 0.6, 0.32, 0.12] as const

const t01 = (q: number) => smooth(remap(q, 0.04, 0.92))
const t12 = (q: number) => smooth(remap(q, 1.04, 1.88))
const t23 = (q: number) => smooth(remap(q, 2.04, 2.66))
const t23w = (q: number) => smooth(remap(q, 2.04, 2.5))

const mixFr = (a: Frame, b: Frame, t: number): Frame => ({
  h: lerp(a.h, b.h, t),
  r: lerp(a.r, b.r, t),
  w: lerp(a.w, b.w, t),
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
})

// The open pod grows a little when Telli's suggestions arrive, and shrinks when they are added.
export const p2h = (m2: number) => lerp(lerp(P2.h, 316, eio(remap(m2, 2150, 2450))), 278, eio(remap(m2, 3050, 3350)))

// The card's frame at camera position `q`, given beat 2's story time `m2`.
export const frameAt = (q: number, m2 = 0): Frame => {
  const open: Frame = { h: p2h(m2), r: P2.r, w: P2.w, x: P2.x, y: P2.y }
  if (q <= 1) return mixFr(P1, open, t01(q))
  if (q <= 2) return mixFr(open, P3, t12(q))
  const w = t23w(q)
  const h = t23(q)
  return {
    h: lerp(P3.h, P4.h, h),
    r: lerp(P3.r, P4.r, h),
    w: lerp(P3.w, P4.w, w),
    x: lerp(P3.x, P4.x, w),
    y: lerp(P3.y, P4.y, h),
  }
}

// One value per beat, blended between beats like the card.
export const pose = (q: number, a: number, b: number, c: number, d: number) =>
  q <= 1 ? lerp(a, b, t01(q)) : q <= 2 ? lerp(b, c, t12(q)) : lerp(c, d, t23(q))

// Where the pod's header (tile, name, members) sits inside the card on each beat.
export const headTop = (q: number) => pose(q, 22, 24, 20, 10)
export const headPadR = (q: number) => pose(q, 16, 16, 14, 42)

// The members' avatars overlap by 6 px.
export const STACK_BOX = 60
export const slotLeft = (i: number, n: number) => STACK_BOX - 24 - 18 * (n - 1 - i)

// The deck on beat 1: four cards fall one after another.
export const DECK_N = 4
export const DECK_STEP = 640
export const DECK_IN = 520
const DECK_RISE = 12
const DECK_SHRINK = 0.05
const DECK_DEPTHS = [0, 1, 2, 3] as const
const DECK_FADE = [1, 0.7, 0.46, 0.26] as const
const DECK_FROM = 44

export const deckIn = (i: number, m1: number) => ph(m1, i * DECK_STEP, i * DECK_STEP + DECK_IN)

// How many cards have landed on top of card `i`, counting a card still landing by how far it has.
export const deckDepth = (i: number, m1: number) => {
  let depth = 0
  for (let j = i + 1; j < DECK_N; j++) depth += eio(deckIn(j, m1))
  return depth
}

// Card `i`'s opacity, lift and scale at deck time `m1`, for a card `h` tall.
export const deckPose = (i: number, m1: number, h: number) => {
  const landed = eo(deckIn(i, m1))
  const depth = deckDepth(i, m1)
  const shrink = 1 - DECK_SHRINK * depth
  return {
    o: eo(ph(m1, i * DECK_STEP, i * DECK_STEP + 120)) * interp(depth, DECK_DEPTHS, DECK_FADE),
    s: shrink * (0.96 + 0.04 * landed),
    ty: -DECK_RISE * depth - (h / 2) * (1 - shrink) + DECK_FROM * (1 - landed),
  }
}

// How much of card `i`'s face shows: it fades as the next card lands on it, and the last card keeps its face.
export const deckFace = (i: number, m1: number) => {
  if (i >= DECK_N - 1) return 1
  const t0 = (i + 1) * DECK_STEP
  return 1 - eo(ph(m1, t0, t0 + 160))
}

// The vertical span each beat's content takes in the canvas, for fitting the canvas into the stage.
export const KEY_SPAN: readonly (readonly [number, number])[] = [
  [P1.y - 36, P1.y + P1.h + 4],
  [P2.y - 44 - 16 - 5, P2.y + P2.h],
  [16, 330],
  [ROW_Y[0], (ROW_Y[3] ?? 0) + ROW_H],
]

// Telli waits above the open pod, then flies to its slot among the members.
export const TELLI_WAIT: Point = [P2.x + P2.w / 2, P2.y - 44]
export const TELLI_SLOT: Point = [P2.x + P2.w - 16 - STACK_BOX + slotLeft(1, 2) + 12, P2.y + 24 + 8 + 12]

const cubic = (p0: Point, c1: Point, c2: Point, p3: Point, t: number): Point => {
  const u = 1 - t
  const a = u * u * u
  const b = 3 * u * u * t
  const c = 3 * u * t * t
  const d = t * t * t
  return [a * p0[0] + b * c1[0] + c * c2[0] + d * p3[0], a * p0[1] + b * c1[1] + c * c2[1] + d * p3[1]]
}

export const telliAt = (t: number) =>
  cubic(TELLI_WAIT, [TELLI_WAIT[0] + 64, TELLI_WAIT[1]], [TELLI_SLOT[0], TELLI_SLOT[1] - 64], TELLI_SLOT, t)

// The one-time link flies from Paula's side of the line to her avatar on beat 3.
const KEY_A: Point = [P3.x + P3.w - 52, P3.y + 44]
export const KEY_B: Point = [PAULA_AV.cx, PAULA_AV.cy]
const KEY_C: Point = [(KEY_A[0] + KEY_B[0]) / 2, -18]

export const keyAt = (t: number): Point => {
  const u = 1 - t
  return [
    u * u * KEY_A[0] + 2 * u * t * KEY_C[0] + t * t * KEY_B[0],
    u * u * KEY_A[1] + 2 * u * t * KEY_C[1] + t * t * KEY_B[1],
  ]
}

export const P_SLOT: Point = [P3.x + P3.w - 14 - STACK_BOX + slotLeft(2, 3) + 12, P3.y + 20 + 8 + 12]

// The info rows on beat 2 (Meals, Portion) and on beat 3, and how far the beat-3 ones sit from the beat-2 ones.
export const ROW2: readonly Point[] = [
  [15, 133],
  [15, 195],
]
export const ROW3: readonly Point[] = [
  [14, 92],
  [14, 144],
]
export const ROW_D: Point = [10, -6]

export const rowMorph = (q: number) => smooth(remap(q, 1.04, 1.7))

// How the canvas fits the stage on each beat: its scale, and where it sits.
export type LivingFit = { s: number[]; x: number[]; y: number[]; mid: number[] }

export const livingFit = (stage: Stage): LivingFit => {
  const k = stage.w / CW
  const s: number[] = []
  const x: number[] = []
  const y: number[] = []
  const mid: number[] = []
  for (let i = 0; i < 4; i++) {
    const [top, bottom] = stage.keyBox?.[i] ?? [0, stage.h - (stage.keyInsets[i] ?? 0)]
    const [a, b] = KEY_SPAN[i] ?? [0, 0]
    const scale = Math.min(k, Math.max(0.5, (bottom - top - 24) / (b - a)))
    s.push(scale)
    x.push((stage.w - CW * scale) / 2)
    y.push(top + (bottom - top - (b - a) * scale) / 2 - a * scale)
    mid.push((top + bottom) / 2)
  }
  return { mid, s, x, y }
}
