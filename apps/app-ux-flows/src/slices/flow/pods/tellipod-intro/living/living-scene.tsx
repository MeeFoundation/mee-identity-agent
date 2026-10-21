// The living-pod scene (the prototype's v2): a flat pod card that changes shape from beat to beat on a 402×360 canvas,
// fitted into the stage. Replaces the isometric world and its overlays.

import { memo, useMemo, useRef } from 'react'

import { useFrameStyle, useIntroScene } from '../engine/frame'
import { CH, CW, frameAt, KEY_SPAN, livingFit, P2, p2h, pose, ROW_FADE, ROW_X, ROW_Y, T1_V2 } from '../engine/living'
import { eio, eo, lerp, ph, remap, smooth } from '../engine/math'
import { T2 } from '../engine/timeline'
import { palette } from '../scene/palette'
import { Deck } from './deck'
import { abs, PodRow } from './parts'
import { PodCard } from './pod-card'
import type { PodId } from './pods'
import { KeyPath, PaulaChipFlight, PaulaSide, Telli } from './side'

const NONE = { pointerEvents: 'none' } as const

const GLOW_W = 520
const GLOW_H = 440
const withAlpha = (hex: string, alpha: number) =>
  `${hex}${Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0')}`
const GLOW = `radial-gradient(ellipse closest-side at 50% 50%, ${withAlpha(palette['brand-300'], 0.5)} 0%, ${withAlpha(palette['brand-200'], 0.3)} 50%, ${withAlpha(palette['brand-100'], 0.06)} 85%, ${withAlpha(palette['brand-100'], 0)} 100%)`

// The soft light behind the card, which widens for the two phones and the list.
const Glow = memo(() => {
  const ref = useRef<HTMLDivElement>(null)
  useFrameStyle(ref, (iv) => {
    const f = frameAt(iv.q.value, iv.v2.value * T2)
    const q = iv.q.value
    const wide = q <= 2 ? smooth(remap(q, 1.3, 1.9)) : 1 - smooth(remap(q, 2, 2.6))
    const list = smooth(remap(q, 2.3, 2.9))
    const cx = lerp(lerp(f.x + f.w / 2, 201, wide), 201, list)
    const cy = Math.min(196, Math.max(170, lerp(f.y + f.h / 2 + 20, 190, list)))
    const kx = (lerp(f.w, 380, Math.max(wide, list)) + 230) / GLOW_W
    const ky = Math.min(330, lerp(f.h, 300, list) + 120) / GLOW_H
    return {
      opacity: 0.9 * eo(ph(iv.a1.value * T1_V2, 0, 600)),
      transform: [{ translateX: cx - GLOW_W / 2 }, { translateY: cy - GLOW_H / 2 }, { scaleX: kx }, { scaleY: ky }],
    }
  })
  return (
    <div aria-hidden ref={ref} style={{ ...abs(0, 0, { background: GLOW, height: GLOW_H, width: GLOW_W }), ...NONE }} />
  )
})

// The other pods, which slide in below Ginger's row on the last beat.
const ListRow = ({ pod, row, at }: { pod: PodId; row: number; at: number }) => {
  const ref = useRef<HTMLDivElement>(null)
  const y = ROW_Y[row] ?? 0
  const from = (ROW_Y[0] ?? 0) - y
  const fade = ROW_FADE[row] ?? 1
  useFrameStyle(ref, (iv) => {
    const q = iv.q.value
    const t = eo(remap(q, at, at + 0.44))
    const o = fade * remap(q, at - 0.04, at + 0.12)
    return {
      display: o > 0.001 ? 'flex' : 'none',
      opacity: o,
      transform: [{ translateY: from * (1 - t) }, { scale: 0.94 + 0.06 * t }],
    }
  })
  return (
    <div aria-hidden ref={ref} style={{ ...abs(ROW_X, y), ...NONE }}>
      <PodRow pod={pod} />
    </div>
  )
}

const PodList = memo(() => (
  <>
    <ListRow at={2.34} pod="home" row={3} />
    <ListRow at={2.31} pod="sofia" row={2} />
    <ListRow at={2.28} pod="kyoto" row={1} />
  </>
))

type SceneActions = { inviteTelli: () => void; addAll: () => void }

export const LivingScene = ({ actions }: { actions: SceneActions }) => {
  const { stage } = useIntroScene()
  const fit = useMemo(() => livingFit(stage), [stage])
  const canvasRef = useRef<HTMLDivElement>(null)
  useFrameStyle(canvasRef, (iv) => {
    const q = iv.q.value
    const m2 = iv.v2.value * T2
    const k = pose(q, fit.s[0] ?? 1, fit.s[1] ?? 1, fit.s[2] ?? 1, fit.s[3] ?? 1)
    const x = pose(q, fit.x[0] ?? 0, fit.x[1] ?? 0, fit.x[2] ?? 0, fit.x[3] ?? 0)
    const top = lerp(KEY_SPAN[1]?.[0] ?? 0, P2.y, eio(ph(m2, 1300, 2000)))
    const y1 = (fit.mid[1] ?? 0) - ((top + P2.y + p2h(m2)) / 2) * (fit.s[1] ?? 1)
    const y = pose(q, fit.y[0] ?? 0, y1, fit.y[2] ?? 0, fit.y[3] ?? 0)
    return { transform: [{ translateX: x - (CW / 2) * (1 - k) }, { translateY: y - (CH / 2) * (1 - k) }, { scale: k }] }
  })
  return (
    <div style={{ ...abs(0, 0, { height: stage.h, width: stage.w }), ...NONE }}>
      <div ref={canvasRef} style={{ ...abs(0, 0, { height: CH, width: CW }), ...NONE }}>
        <Glow />
        <PodList />
        <Deck />
        <PaulaSide />
        <PodCard actions={actions} />
        <PaulaChipFlight />
        <KeyPath />
        <Telli />
      </div>
    </div>
  )
}
