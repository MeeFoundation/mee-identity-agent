// Port of the prototype's AttentionRing: a ring around the control to tap next, with a ripple that spreads and fades
// on the attention loop. Place it inside a positioned wrapper that is the size of the control.

import { memo, useRef } from 'react'

import { HL_CLEAR, HL_GAP, HL_SPREAD, HL_STROKE, ripple } from '../engine/attention'
import { useFrameStyle, useIntroScene } from '../engine/frame'
import { eo } from '../engine/math'
import type { IntroValues } from '../engine/values'
import { palette } from '../scene/palette'

type AttentionRingProps = {
  // Whether the control is available; the ring only shows then.
  live: (iv: IntroValues) => boolean
  // The control's corner radius.
  radius: number
  // The scale the control is drawn at, so the ring keeps its size on screen.
  scale?: number
  // Room around the control; the ripple stops short of it.
  room?: number
}

export const AttentionRing = memo(({ live, radius, scale = 1, room }: AttentionRingProps) => {
  const { reducedMotion } = useIntroScene()
  const rippleRef = useRef<HTMLSpanElement>(null)
  const ringRef = useRef<HTMLSpanElement>(null)
  const x = 1 / scale
  const gap = (HL_GAP + HL_STROKE) * x
  const stroke = HL_STROKE * x
  const spread = room === undefined ? HL_SPREAD * x : Math.max(0, Math.min(HL_SPREAD * x, room - HL_CLEAR * x - gap))

  useFrameStyle(ringRef, (iv) => {
    const on = live(iv)
    return { display: on ? 'flex' : 'none', opacity: on ? 1 : 0 }
  })
  useFrameStyle(rippleRef, (iv) => {
    const r = ripple(iv.hl.value, reducedMotion)
    const on = live(iv) && r >= 0
    const t = on ? r : 0
    const out = gap + spread * eo(t)
    const opacity = on ? 0.9 * (1 - t) ** 1.2 : 0
    return {
      borderRadius: radius + out,
      bottom: -out,
      display: opacity > 0.001 ? 'flex' : 'none',
      left: -out,
      opacity,
      right: -out,
      top: -out,
    }
  })

  return (
    <>
      <span
        ref={rippleRef}
        style={{
          backgroundColor: `${palette['brand-500']}29`,
          border: `${stroke}px solid ${palette['brand-400']}`,
          pointerEvents: 'none',
          position: 'absolute',
        }}
      />
      <span
        ref={ringRef}
        style={{
          border: `${stroke}px solid ${palette['brand-500']}`,
          borderRadius: radius + gap,
          bottom: -gap,
          left: -gap,
          pointerEvents: 'none',
          position: 'absolute',
          right: -gap,
          top: -gap,
        }}
      />
    </>
  )
})
