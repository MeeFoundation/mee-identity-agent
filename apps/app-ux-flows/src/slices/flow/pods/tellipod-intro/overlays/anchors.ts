// Port of the prototype's world anchors (`useAnchor`): world points the overlays hang from, and how an overlay box is
// placed and scaled on the stage as the camera moves. In tap mode the Ginger chip is large and nudged on the first beat.

import { type RefObject, useMemo } from 'react'

import { HL_GAP, HL_SPREAD, HL_STROKE } from '../engine/attention'
import { type Camera, w2s } from '../engine/camera'
import { type FrameStyle, type TransformStep, useFrameStyle, useIntroScene } from '../engine/frame'
import { bezierQ, eio, iso, lerp, type Point, ph } from '../engine/math'
import { T3 } from '../engine/timeline'
import type { Box, Stage } from '../engine/values'

const CHIP_H = 24
const EDGE_MARGIN = 8
export const TAG_SCALE = 1.5
// Height of a tag pill (size M).
export const TAG_H = 36
// Height of a tag pill (size L), which the Ginger tag takes in tap mode while the home is in view.
export const TAG_H_L = 44
// The pill's scale in size L: it never shrinks below its natural size.
export const pillScale = (ui: number) => Math.max(ui, 1)
const TAP_EDGE = 16
// The Ginger tag stays large until the camera has moved this far into the intro.
const GINGER_L_UNTIL = 2
const GINGER_TAP_NUDGE = [-10, 5] as const
// How far a control's ring and ripple reach beyond it.
const HL_REACH = HL_GAP + HL_STROKE + HL_SPREAD

export const TAG_KYOTO = iso(-62, -62, 68)
const TAG_GINGER = iso(106, -46, 0)
export const TAG_SOFIA = iso(40, 86, 0)
export const TELLI_WAIT = iso(46, -72, 24)
export const DESK_PAPER = iso(11, -42, 12.5)
const DOOR_TOP = iso(50, -62, 30)
const GINGER_LIFT = 5
const BED = { r: 9, u: 54, v: -22 }
const BED_FRONT = iso(BED.u + BED.r * Math.SQRT1_2, BED.v + BED.r * Math.SQRT1_2, 0)

type StageBox = { w: number; h: number }

// Keeps a chip of `w`×`h` centred at `c` inside the stage, `edge` from its sides.
const clampChip = (c: Point, w: number, h: number, stage: StageBox, edge?: number): Point => {
  const m = edge === undefined ? EDGE_MARGIN : edge
  const x0 = m + w / 2
  const x1 = stage.w - m - w / 2
  const y0 = m + h / 2
  const y1 = stage.h - m - h / 2
  return [
    x0 > x1 ? stage.w / 2 : Math.min(x1, Math.max(x0, c[0])),
    y0 > y1 ? stage.h / 2 : Math.min(y1, Math.max(y0, c[1])),
  ]
}

// Ginger's room on Paula's phone, which hangs `dv` below the world.
export const paulaGinger = (dv: number) => iso(-31, -31 + dv, 14)

// The dotted line from Ginger's door to Paula's phone, as a quadratic curve.
const lineCurve = (dv: number): readonly [Point, Point, Point] => {
  const P0 = DOOR_TOP
  const P2 = paulaGinger(dv)
  const C: Point = [(P0[0] + P2[0]) / 2 - 6, Math.min(P0[1], P2[1]) - 46]
  return [P0, C, P2]
}

// How far the one-time key has travelled along the line.
export const keyTOf = (v3: number) => eio(ph(v3 * T3, 200, 1100))

export const linePoint = (dv: number, t: number) => {
  const [P0, C, P2] = lineCurve(dv)
  return bezierQ(P0, C, P2, t)
}

type Placement = { translateX: number; translateY: number; scale: number }

// Moves a `bw`×`bh` box so its point (`ax`, `ay`) lands on the stage point (`sx`, `sy`), scaled by `s` around its centre.
export const place = (
  sx: number,
  sy: number,
  ax: number,
  ay: number,
  bw: number,
  bh: number,
  s: number,
): Placement => ({
  scale: s,
  translateX: sx - bw / 2 - s * (ax - bw / 2),
  translateY: sy - bh / 2 - s * (ay - bh / 2),
})

export const placeTransform = (p: Placement): readonly TransformStep[] => [
  { translateX: p.translateX },
  { translateY: p.translateY },
  { scale: p.scale },
]

// What the Ginger tag's geometry depends on: the stage box and, in tap mode, its edge margin.
export type GingerGeo = StageBox & { ui: number; edge?: number; tap?: true }

const gingerGeo = (stage: Stage, tap: boolean): GingerGeo =>
  tap ? { edge: TAP_EDGE * stage.ui, h: stage.h, tap: true, ui: stage.ui, w: stage.w } : stage

// The Ginger tag's geometry for the running intro's mode.
export const useGingerGeo = () => {
  const { stage, tap } = useIntroScene()
  return useMemo(() => gingerGeo(stage, tap), [stage, tap])
}

// Whether the Ginger tag is drawn large: in tap mode, while the first beat's home is in view.
export const gingerIsL = (geo: GingerGeo, q: number) => geo.tap === true && q <= GINGER_L_UNTIL

export const gingerDims = (geo: GingerGeo, q: number) =>
  gingerIsL(geo, q) ? { k: pillScale(geo.ui), th: TAG_H_L } : { k: geo.ui, th: TAG_H }

// Where the Ginger tag's chip sits: on Ginger's room, docking into the card's header as `dockW` goes to 1.
export const gingerChipCentre = (cam: Camera, dockW: number, chipW: number, geo: GingerGeo, q = 0): Point => {
  const ui = geo.ui
  const { k, th } = gingerDims(geo, q)
  const raw = w2s(TAG_GINGER, cam, geo.w, geo.h)
  let wy = raw[1] - GINGER_LIFT * ui
  if (gingerIsL(geo, q)) wy = Math.max(wy, w2s(BED_FRONT, cam, geo.w, geo.h)[1] + HL_REACH + (th * k) / 2)
  const first = geo.tap === true && q < 1
  if (first) wy += GINGER_TAP_NUDGE[1] * ui
  const c = clampChip([raw[0], wy], chipW * k, th * k, geo, geo.edge)
  const w: Point = first ? [c[0] + GINGER_TAP_NUDGE[0] * ui, c[1]] : c
  return [lerp(w[0], 16 * ui + (chipW * k) / 2, dockW), lerp(w[1], 8 * ui + (th * k) / 2, dockW)]
}

// The member avatars beside the Ginger tag: above it on the home, next to it once docked.
export const gingerStackGeo = (cam: Camera, dockW: number, chipW: number, n: number, geo: GingerGeo, q = 0) => {
  const ui = geo.ui
  const tk = ui * TAG_SCALE
  const { k, th } = gingerDims(geo, q)
  const c = gingerChipCentre(cam, dockW, chipW, geo, q)
  const sw = (24 + 18 * (n - 1)) * tk
  const wl = c[0] - sw / 2
  const wy = c[1] - (th / 2) * k - 6 * ui - 12 * tk
  const dl = c[0] + (chipW * k) / 2 + 6 * ui
  return { chip: c, cy: lerp(wy, c[1], dockW), left: lerp(wl, dl, dockW) }
}

type AnchorOptions = {
  // The overlay's own box, and the point in it that hangs on the anchor (its centre by default).
  box: readonly [number, number]
  at?: readonly [number, number]
  scale?: () => number
  opacity?: () => number
  offset?: () => readonly [number, number]
  // The chip width to keep inside the stage: measured, or computed.
  clampW?: Box<number> | (() => number)
  clampH?: number
  edge?: number
}

// Hangs an overlay on a world point (or a point computed from the camera) every frame.
export const useAnchor = <E extends HTMLElement>(
  ref: RefObject<E | null>,
  stage: Stage,
  anchor: Point | ((cam: Camera) => Point),
  options: AnchorOptions,
) => {
  const [bw, bh] = options.box
  const [ax, ay] = options.at ?? [bw / 2, bh / 2]
  const clampH = options.clampH ?? CHIP_H
  useFrameStyle(ref, (iv): FrameStyle => {
    const cam = iv.cam.value
    const k = stage.ui * (options.scale ? options.scale() : 1)
    const raw = typeof anchor === 'function' ? anchor(cam) : w2s(anchor, cam, stage.w, stage.h)
    const { clampW } = options
    const cw = clampW === undefined ? 0 : typeof clampW === 'function' ? clampW() : clampW.value
    const s = clampW !== undefined ? clampChip(raw, cw * k, clampH * k, stage, options.edge) : raw
    const o = options.offset ? options.offset() : [0, 0]
    const op = options.opacity ? options.opacity() : 1
    return {
      display: op > 0.001 ? 'flex' : 'none',
      opacity: op,
      transform: placeTransform(place(s[0] + (o[0] ?? 0), s[1] + (o[1] ?? 0), ax, ay, bw, bh, k)),
    }
  })
}
