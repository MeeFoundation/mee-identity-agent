// The members on Ginger's card: Telli and Paula join with a dashed slot, a pop and a ring, and the sync badge that
// shows the pod is shared. Ported from the prototype's `SceneV2`.

import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useFrameStyle, useIntroScene } from '../engine/frame'
import { STACK_BOX, slotLeft } from '../engine/living'
import { eio, eo, ph, pulse, smooth } from '../engine/math'
import { T2, T3 } from '../engine/timeline'
import type { IntroValues } from '../engine/values'
import { shadow } from '../overlays/ui'
import { light, palette } from '../scene/palette'
import { abs, Member, SyncGlyph } from './parts'

const m2Of = (iv: IntroValues) => iv.v2.value * T2
const m3Of = (iv: IntroValues) => iv.v3.value * T3

// How many members the card shows, counting Telli and Paula as they arrive.
const memberCount = (iv: IntroValues) => 1 + smooth(ph(m2Of(iv), 1150, 1450)) + smooth(ph(m3Of(iv), 1150, 1380))

const SLOT = {
  borderRadius: 12,
  borderStyle: 'dashed',
  borderWidth: 1.5,
  boxSizing: 'border-box',
  height: 24,
  width: 24,
} as const

const RING = {
  borderRadius: 12,
  borderStyle: 'solid',
  borderWidth: 2,
  boxSizing: 'border-box',
  height: 24,
  width: 24,
} as const

export const MemberStack = () => {
  const { t } = useTranslation()
  const youRef = useRef<HTMLSpanElement>(null)
  const telliSlotRef = useRef<HTMLSpanElement>(null)
  const telliRingRef = useRef<HTMLSpanElement>(null)
  const telliRef = useRef<HTMLSpanElement>(null)
  const paulaSlotRef = useRef<HTMLSpanElement>(null)
  const paulaRingRef = useRef<HTMLSpanElement>(null)
  const paulaRef = useRef<HTMLSpanElement>(null)

  useFrameStyle(youRef, (iv) => ({ transform: [{ translateX: slotLeft(0, memberCount(iv)) }] }))
  useFrameStyle(telliSlotRef, (iv) => {
    const m = m2Of(iv)
    return {
      opacity: ph(m, 1180, 1320) * (1 - ph(m, 1960, 2010)),
      transform: [{ translateX: slotLeft(1, memberCount(iv)) }, { scale: 0.6 + 0.4 * eo(ph(m, 1180, 1400)) }],
    }
  })
  useFrameStyle(telliRef, (iv) => {
    const m = m2Of(iv)
    return {
      opacity: ph(m, 1960, 2010),
      transform: [{ translateX: slotLeft(1, memberCount(iv)) }, { scale: 1 + 0.2 * pulse(ph(m, 1990, 2240)) }],
    }
  })
  useFrameStyle(telliRingRef, (iv) => {
    const e = ph(m2Of(iv), 1990, 2400)
    return {
      opacity: (1 - e) * (e > 0 ? 0.9 : 0),
      transform: [{ translateX: slotLeft(1, memberCount(iv)) }, { scale: 1 + 0.9 * eo(e) }],
    }
  })
  useFrameStyle(paulaSlotRef, (iv) => {
    const m = m3Of(iv)
    return {
      opacity: ph(m, 1180, 1300) * (1 - ph(m, 1600, 1640)),
      transform: [{ translateX: slotLeft(2, memberCount(iv)) }, { scale: 0.6 + 0.4 * eo(ph(m, 1180, 1380)) }],
    }
  })
  useFrameStyle(paulaRef, (iv) => {
    const m = m3Of(iv)
    return {
      opacity: ph(m, 1600, 1640),
      transform: [{ translateX: slotLeft(2, memberCount(iv)) }, { scale: 1 + 0.2 * pulse(ph(m, 1620, 1860)) }],
    }
  })
  useFrameStyle(paulaRingRef, (iv) => {
    const e = ph(m3Of(iv), 1620, 2000)
    return {
      opacity: (1 - e) * (e > 0 ? 0.9 : 0),
      transform: [{ translateX: slotLeft(2, memberCount(iv)) }, { scale: 1 + 0.9 * eo(e) }],
    }
  })

  const slot = {
    ...SLOT,
    backgroundColor: light['surface-brand-soft'],
    borderColor: palette['brand-400'],
  }
  const ring = { ...RING, borderColor: palette['brand-400'] }

  return (
    <span style={{ display: 'block', height: 24, position: 'relative', width: STACK_BOX }}>
      <span ref={paulaSlotRef} style={abs(0, 0, slot)} />
      <span ref={telliSlotRef} style={abs(0, 0, slot)} />
      <span ref={paulaRingRef} style={abs(0, 0, ring)} />
      <span ref={telliRingRef} style={abs(0, 0, ring)} />
      <span ref={paulaRef} style={abs(0, 0, { zIndex: 1 })}>
        <Member who={{ initial: t('pods.tellipodIntro.pod.paulaInitial') }} />
      </span>
      <span ref={telliRef} style={abs(0, 0, { zIndex: 2 })}>
        <Member who="telli" />
      </span>
      <span ref={youRef} style={abs(0, 0, { zIndex: 3 })}>
        <Member who="you" />
      </span>
    </span>
  )
}

// The badge on a shared pod's corner: it pops in when Paula's phone opens the pod, pulses, and its arrows turn once.
export const SyncBadge = ({ visible }: { visible: (iv: IntroValues) => number }) => {
  const { reducedMotion } = useIntroScene()
  const ringRef = useRef<HTMLSpanElement>(null)
  const badgeRef = useRef<HTMLSpanElement>(null)
  const glyphRef = useRef<HTMLSpanElement>(null)
  useFrameStyle(badgeRef, (iv) => {
    const m = m3Of(iv)
    const o = ph(m, 1150, 1350) * visible(iv)
    const k = reducedMotion ? 0 : pulse(ph(m, 1650, 1950))
    return {
      display: o > 0.001 ? 'flex' : 'none',
      opacity: o,
      transform: [{ scale: (0.6 + 0.4 * eo(ph(m, 1150, 1350))) * (1 + 0.22 * k) }],
    }
  })
  useFrameStyle(glyphRef, (iv) => ({
    transform: [{ rotate: `${reducedMotion ? 0 : 360 * eio(ph(m3Of(iv), 1650, 2150))}deg` }],
  }))
  useFrameStyle(ringRef, (iv) => {
    const t = ph(m3Of(iv), 1650, 2150)
    return {
      opacity: reducedMotion ? 0 : (1 - t) * (t > 0 ? 0.8 : 0) * visible(iv),
      transform: [{ scale: 1 + 1.1 * eo(t) }],
    }
  })
  return (
    <span aria-hidden style={{ display: 'block', height: 26, position: 'relative', width: 26 }}>
      <span
        ref={ringRef}
        style={abs(0, 0, {
          border: `2px solid ${palette['brand-300']}`,
          borderRadius: 13,
          boxSizing: 'border-box',
          height: 26,
          width: 26,
        })}
      />
      <span
        ref={badgeRef}
        style={abs(0, 0, {
          alignItems: 'center',
          backgroundColor: palette['brand-500'],
          border: '2px solid #ffffff',
          borderRadius: 13,
          boxShadow: shadow[3],
          boxSizing: 'border-box',
          display: 'flex',
          height: 26,
          justifyContent: 'center',
          width: 26,
        })}
      >
        <span ref={glyphRef} style={{ display: 'flex' }}>
          <SyncGlyph size={13} />
        </span>
      </span>
    </span>
  )
}
