// Port of the prototype's TelliFlyer: Telli waits outside Ginger's door, then flies in to join the pod's members.

import { useRef } from 'react'

import { w2s } from '../engine/camera'
import { useFrameStyle, useIntroScene } from '../engine/frame'
import { eio, lerp, type Point, ph, remap } from '../engine/math'
import { T2 } from '../engine/timeline'
import type { Box } from '../engine/values'
import { light } from '../scene/palette'
import { gingerStackGeo, place, placeTransform, TAG_SCALE, TELLI_WAIT, useGingerGeo } from './anchors'
import { Icon, shadow } from './ui'

const S = 32
const RING0 = 2
const RING1 = 2.6666666666666665

const cubic = (p0: Point, c1: Point, c2: Point, p3: Point, t: number): Point => {
  const u = 1 - t
  const a = u * u * u
  const b = 3 * u * u * t
  const c = 3 * u * t * t
  const d = t * t * t
  return [a * p0[0] + b * c1[0] + c * c2[0] + d * p3[0], a * p0[1] + b * c1[1] + c * c2[1] + d * p3[1]]
}

// Telli's path from the door to its slot: up and over, then settling in.
const telliFlight = (a: Point, e: Point, ui: number, t: number, tap: boolean): Point => {
  const c1: Point = [a[0], e[1] - (tap ? 2 : 12) * ui]
  const c2: Point = [a[0] - (a[0] - e[0]) * 0.1, e[1] - (tap ? 0 : 4) * ui]
  return cubic(a, c1, c2, e, t)
}

export const TelliFlyer = ({ chipW }: { chipW: Box<number> }) => {
  const { stage, tap } = useIntroScene()
  const geo = useGingerGeo()
  const ui = stage.ui
  const tk = ui * TAG_SCALE
  const ref = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)

  useFrameStyle(ref, (iv) => {
    const q = iv.q.value
    const m2 = iv.v2.value * T2
    const vis = remap(q, 0.75, 0.95)
    const op = q > 1 ? 0 : vis * (1 - ph(m2, 1950, 2000))
    const cam = iv.cam.value
    const a = w2s(TELLI_WAIT, cam, stage.w, stage.h)
    let pt = a
    if (m2 > 1300) {
      const g = gingerStackGeo(cam, iv.dockW.value, chipW.value, 1, geo, q)
      pt = telliFlight(a, [g.left + 30 * tk, g.cy], ui, eio(ph(m2, 1300, 2000)), tap)
    }
    const size = lerp(1, 0.75, ph(m2, 1300, 2000))
    const k = tk * (0.8 + 0.2 * vis) * size
    return {
      display: op > 0.001 ? 'flex' : 'none',
      opacity: op,
      transform: placeTransform(place(pt[0], pt[1], S / 2, S / 2, S, S, k)),
    }
  })

  useFrameStyle(innerRef, (iv) => {
    const inset = lerp(RING0, RING1, ph(iv.v2.value * T2, 1300, 2000))
    return { borderRadius: S / 2 - inset, height: S - 2 * inset, left: inset, top: inset, width: S - 2 * inset }
  })

  return (
    <div
      aria-hidden
      ref={ref}
      style={{ height: S, left: 0, pointerEvents: 'none', position: 'absolute', top: 0, width: S }}
    >
      <span
        style={{
          backgroundColor: light['stroke-default-main'],
          borderRadius: 16,
          boxShadow: shadow[3],
          height: S,
          left: 0,
          position: 'absolute',
          top: 0,
          width: S,
        }}
      />
      <span
        ref={innerRef}
        style={{
          alignItems: 'center',
          backgroundColor: light['surface-brand-light'],
          display: 'flex',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'absolute',
        }}
      >
        <Icon color={light['surface-brand-main']} name="chat-ai-lock" size={16} />
      </span>
    </div>
  )
}
